#!/bin/bash

set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FILE_PATH="${1:-}"
POST_TYPE="${2:-post}"
POST_SLUG="${3:-unknown}"
GIT_REMOTE="${GIT_PUSH_REMOTE:-origin}"
GIT_BRANCH="${GIT_PUSH_BRANCH:-main}"
RUN_BUILD_ON_PUBLISH="${RUN_BUILD_ON_PUBLISH:-auto}"
ALLOW_BUILD_FAILURE_ON_PUBLISH="${ALLOW_BUILD_FAILURE_ON_PUBLISH:-auto}"

if [ -z "$FILE_PATH" ]; then
	echo "Missing file path argument"
	exit 1
fi

cd "$APP_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
	echo "Not inside a git repository"
	exit 1
fi

should_run_build="0"
if [ "$RUN_BUILD_ON_PUBLISH" = "1" ] || [ "$RUN_BUILD_ON_PUBLISH" = "true" ]; then
	should_run_build="1"
elif [ "$RUN_BUILD_ON_PUBLISH" = "0" ] || [ "$RUN_BUILD_ON_PUBLISH" = "false" ]; then
	should_run_build="0"
elif [ "${NODE_ENV:-}" = "production" ]; then
	should_run_build="1"
fi

allow_build_failure="0"
if [ "$ALLOW_BUILD_FAILURE_ON_PUBLISH" = "1" ] || [ "$ALLOW_BUILD_FAILURE_ON_PUBLISH" = "true" ]; then
	allow_build_failure="1"
elif [ "$ALLOW_BUILD_FAILURE_ON_PUBLISH" = "0" ] || [ "$ALLOW_BUILD_FAILURE_ON_PUBLISH" = "false" ]; then
	allow_build_failure="0"
elif [ "${NODE_ENV:-}" != "production" ]; then
	allow_build_failure="1"
fi

if [ "$should_run_build" = "1" ]; then
	echo "Running production build"
	if ! NODE_ENV=production npm run build; then
		if [ "$allow_build_failure" = "1" ]; then
			echo "Build failed but continuing publish flow in non-production mode"
		else
			echo "Build failed and publish is configured to stop on build failure"
			exit 1
		fi
	fi
else
	echo "Skipping build step (RUN_BUILD_ON_PUBLISH=$RUN_BUILD_ON_PUBLISH, NODE_ENV=${NODE_ENV:-unset})"
fi

echo "Staging $FILE_PATH"
git add "$FILE_PATH"

if git diff --cached --quiet -- "$FILE_PATH"; then
	echo "No staged changes detected for $FILE_PATH; skipping commit and continuing to push."
else
	COMMIT_MESSAGE="publish(${POST_TYPE}): ${POST_SLUG}"
	echo "Creating commit: $COMMIT_MESSAGE"
	git commit -m "$COMMIT_MESSAGE"
fi

echo "Pushing to ${GIT_REMOTE}/${GIT_BRANCH}"
if ! git push "$GIT_REMOTE" "$GIT_BRANCH"; then
	echo "Initial push rejected. Attempting graceful sync with remote branch."

	git fetch "$GIT_REMOTE" "$GIT_BRANCH"

	if git rebase "$GIT_REMOTE/$GIT_BRANCH"; then
		echo "Rebase completed successfully. Retrying push."
		git push "$GIT_REMOTE" "$GIT_BRANCH"
	else
		echo "Rebase failed. Aborting rebase and falling back to merge."
		git rebase --abort || true
		git pull --no-rebase --no-edit "$GIT_REMOTE" "$GIT_BRANCH"
		echo "Merge completed. Retrying push."
		git push "$GIT_REMOTE" "$GIT_BRANCH"
	fi
fi

echo "Post publish workflow completed"