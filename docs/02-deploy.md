# 02 - Deploy to AWS EC2

This project deploys automatically with GitHub Actions. One EC2 instance runs **everything**:

```
Internet
   |
   v
EC2 instance
   |- nginx  (port 80)         -> serves the React build from /usr/share/nginx/html
   |      |- /api/    -> proxy  -> Express API on 127.0.0.1:8000
   |      |- /uploads/ -> proxy -> Express uploads folder
   |
   |- contact-app.service (systemd) -> Express backend in /opt/contact-app/backend
   |- mongod                        -> MongoDB on 127.0.0.1:27017
```

The React app is built with `VITE_API_URL=/api`, so in production the browser calls the API on
the **same** origin (the instance's public IP) and nginx forwards `/api/` to the backend.

## How to deploy

**Option A - automatic:** push to `main` when you change anything under `frontend/`, `backend/`,
`infra/` or the workflow file.

**Option B - manual:** on GitHub go to **Actions** > **Deploy MERN app to EC2** > **Run workflow**.
You can pick a different instance type here (e.g. `t3.small`).

## What the workflow does

1. **build** job: installs frontend dependencies and runs `npm run build`, then saves `dist/`
   as an artifact.
2. **deploy** job:
   - sets up AWS credentials from your secrets;
   - creates or updates the CloudFormation stack in `infra/ec2-instance.yaml` (EC2, security
     group, nginx, Node.js and MongoDB are installed on first boot by the UserData script);
   - finds the instance, starts it if the sandbox stopped it, and reads its current public IP;
   - downloads the SSH private key from SSM Parameter Store;
   - waits for SSH and for the first-boot setup (`cloud-init`) to finish;
   - copies the React build to `/usr/share/nginx/html`;
   - copies the backend to `/opt/contact-app/backend`, runs `npm ci --omit=dev`, writes `.env`
     and restarts the `contact-app` service;
   - checks that the site and the API respond.

When it finishes, the run summary shows the site URL. You can also find it under
**CloudFormation** > your stack > **Outputs** (`WebsiteURL`).

## First use

Open the site URL and **register** an account, then log in. The database starts empty.

## Updating the app

Just push again. The same instance is reused: your code is replaced, the backend is restarted,
and **uploaded photos are preserved** (the deploy never deletes `uploads/`).

## Troubleshooting

- **Workflow fails at "Configure AWS credentials"** - the AWS secrets are missing or the AWS
  Academy credentials expired. Update the secrets and run again.
- **"SSH not ready" / timeout** - the instance is still installing software on first boot. Wait a
  few minutes and run the workflow again.
- **UserData failed** - the workflow prints the last lines of `/var/log/cloud-init-output.log`.
- **Site loads but API fails** - SSH in and check the backend:
  `sudo systemctl status contact-app` and `sudo journalctl -u contact-app -n 50`.
- **Login/registration fails with a token error** - the `JWT_SECRET` secret is missing.

## Cleaning up

To stop paying for resources, delete the stack: AWS Console > **CloudFormation** > select the
stack > **Delete**. This removes the instance, security group and key pair.
