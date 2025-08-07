import { request, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

const STORAGE_STATE = path.join(__dirname, 'storageState.json');

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const requestContext = await request.newContext();

  const email = `testuser-${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  // Register a new user
  const registerResponse = await requestContext.post(`${baseURL}/auth/register`, {
    data: {
      email,
      name,
      password,
      provider: 'email',
    },
  });

  if (!registerResponse.ok()) {
    console.error("Failed to register user:", await registerResponse.text());
    throw new Error("Global setup failed: could not register user.");
  }

  const { token, user } = await registerResponse.json();

  // Save the token to a file to be used as storage state
  // We'll store it in localStorage so the frontend can pick it up.
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: baseURL!,
        localStorage: [
          {
            name: 'authToken',
            value: token,
          },
          {
            name: 'user',
            value: JSON.stringify(user),
          }
        ],
      },
    ],
  };

  fs.writeFileSync(STORAGE_STATE, JSON.stringify(storageState));
  await requestContext.dispose();
}

export default globalSetup;
