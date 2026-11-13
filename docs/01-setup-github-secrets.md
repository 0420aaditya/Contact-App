# 01 - Add GitHub secrets

The deploy workflow needs AWS credentials and a secret key. These are stored as **GitHub
secrets** so they are never written into the code.

## 1. Get your AWS credentials

If you use **AWS Academy Learner Lab**:

1. Open the Learner Lab and click **Start Lab**. Wait until the dot next to "AWS" turns green.
2. Click **AWS Details** (top right), then click **Show** next to "AWS CLI".
3. Copy the three values shown:
   - `aws_access_key_id`
   - `aws_secret_access_key`
   - `aws_session_token`

> AWS Academy credentials are **temporary** (they expire when the lab session ends, usually
> after a few hours). When they expire you must copy the new values and update the secrets
> again before deploying.

If you use a normal AWS account (no session token), you only need the access key and secret
key, and you can skip the `AWS_SESSION_TOKEN` secret.

## 2. Add the secrets to GitHub

1. Open your repository on GitHub.
2. Go to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret** and add these, one at a time:

   | Name | Value |
   | --- | --- |
   | `AWS_ACCESS_KEY_ID` | your access key id |
   | `AWS_SECRET_ACCESS_KEY` | your secret access key |
   | `AWS_SESSION_TOKEN` | your session token (AWS Academy only; skip if you don't have one) |
   | `JWT_SECRET` | any long random string, e.g. `openssl rand -hex 32` (used to sign login tokens) |

4. After adding them you should see four secrets listed (three if you skipped the session token).

## 3. Region

The workflow deploys to **us-east-1** by default. If your sandbox uses a different region,
change `AWS_REGION` at the top of `.github/workflows/deploy.yml`.

That's it - the workflow can now use these secrets.
