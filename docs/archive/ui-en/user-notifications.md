# Notifications

Mentions work in project descriptions, notes, findings, comments, host notes and endpoint descriptions. Use `@username` or `@{Full Name}`. Editing notifies newly mentioned people only; authors do not notify themselves. Recipients must be active project members or administrators.

Project deadline reminders appear when the end date is today or within the next two days (UTC calendar). Completed/archived projects are excluded. Active members receive one reminder per end date, including across application restarts. Notifications refresh automatically through WebSocket, on window focus and with a 30-second fallback poll.

Notifications are personal events. The project activity feed provides the broader history of who changed assessment data.

## Notification types

- Someone mentions you in a finding or note comment.
- Someone adds you to a project.
- Someone changes the status of a finding you reported.
- Someone changes the status of a project you belong to.

You do not receive notifications for your own initiating action.

## Reading notifications

Click the bell in the top bar. A dot indicates unread items, and the panel shows the unread count. Click an item to open the related object and mark it read. **Mark all read** marks the whole list as read.

Notifications load with the application; live updates are delivered through its WebSocket connection. Reload the page if the connection has been interrupted.
