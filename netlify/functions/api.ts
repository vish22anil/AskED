import serverless from 'serverless-http';
import app from '../../backend/src/app';
import { ensureGuestUser } from '../../backend/src/services/guestUserService';

let guestUserEnsured = false;
const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  if (!guestUserEnsured) {
    await ensureGuestUser();
    guestUserEnsured = true;
  }
  return serverlessHandler(event, context);
};
