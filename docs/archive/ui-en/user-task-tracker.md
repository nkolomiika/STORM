# Task Tracker

**Tasks** shows read-only tasks from the configured Task Tracker/Works integration. If the integration is unavailable or not configured, the page shows the corresponding message. Connection settings belong to the deployment.

## Task list

Active and closed tabs group workflow states. Search filters task titles; sorting switches update order. Status labels and colours follow the finding workflow. Clicking a task key opens it in the tracker.

## Task details

Click a row to see its key, title, description, status, type, priority, assignee, reporter, timestamps, and labels. **Open in Task Tracker** opens the original task.

## Creating a linked project

The plus action loads the full task card and opens the project form with its AppSec ticket, assignee and **all affected versions** prefilled. Missing optional metadata stays empty. You can edit the copied values, enter the project name and save. If a project is already linked to that ticket, the action opens the existing project instead. Creating a project requires administrator permissions.

The list and task card show affected versions with their complete original names. Local sample tickets are marked **Demo data**; this mode does not export to the external tracker.
