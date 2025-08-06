import { api, APIError } from "encore.dev/api";
import { userDB } from "./db";
import { generateJWT } from "./jwt";

// TODO: Replace with your actual OAuth credentials from Google Cloud Console.
const googleClientId = "your-google-client-id";
const googleClientSecret = "your-google-client-secret";

// TODO: Replace with your actual OAuth credentials from LinkedIn Developer Portal.
const linkedinClientId = "your-linkedin-client-id";
const linkedinClientSecret = "your-linkedin-client-secret";

export interface OAuthCallbackRequest {
  code: string;
  provider: string;
  redirectUri: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
    provider: string;
  };
  token: string;
}

// Handles OAuth callback and creates or logs in user.
export const oauthCallback = api<OAuthCallbackRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/auth/oauth/callback" },
  async (req) => {
    let userInfo;

    switch (req.provider) {
      case "google":
        userInfo = await handleGoogleOAuth(req.code, req.redirectUri);
        break;
      case "linkedin":
        userInfo = await handleLinkedInOAuth(req.code, req.redirectUri);
        break;
      default:
        throw APIError.invalidArgument("unsupported OAuth provider");
    }

    // Check if user exists
    let user = await userDB.queryRow`
      SELECT id, email, name, image_url, provider
      FROM users 
      WHERE email = ${userInfo.email} AND provider = ${req.provider}
    `;

    if (!user) {
      // Create new user
      user = await userDB.queryRow`
        INSERT INTO users (email, name, provider, provider_id, image_url)
        VALUES (${userInfo.email}, ${userInfo.name}, ${req.provider}, ${userInfo.id}, ${userInfo.picture || null})
        RETURNING id, email, name, image_url, provider
      `;
    } else {
      // Update user info
      user = await userDB.queryRow`
        UPDATE users 
        SET name = ${userInfo.name}, image_url = ${userInfo.picture || null}, updated_at = NOW()
        WHERE id = ${user.id}
        RETURNING id, email, name, image_url, provider
      `;
    }

    if (!user) {
      throw APIError.internal("failed to create or update user");
    }

    // Generate JWT token
    const token = await generateJWT({
      sub: user.id,
      email: user.email,
      name: user.name
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.image_url,
        provider: user.provider
      },
      token
    };
  }
);

async function handleGoogleOAuth(code: string, redirectUri: string) {
  // Exchange code for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    throw APIError.internal("failed to exchange Google OAuth code");
  }

  const tokenData = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!userResponse.ok) {
    throw APIError.internal("failed to get Google user info");
  }

  return await userResponse.json();
}

async function handleLinkedInOAuth(code: string, redirectUri: string) {
  // Exchange code for access token
  const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: linkedinClientId,
      client_secret: linkedinClientSecret,
    }),
  });

  if (!tokenResponse.ok) {
    throw APIError.internal("failed to exchange LinkedIn OAuth code");
  }

  const tokenData = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch("https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress,profilePicture(displayImage~:playableStreams))", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!userResponse.ok) {
    throw APIError.internal("failed to get LinkedIn user info");
  }

  const userData = await userResponse.json();

  return {
    id: userData.id,
    email: userData.emailAddress,
    name: `${userData.firstName.localized.en_US} ${userData.lastName.localized.en_US}`,
    picture: userData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
  };
}
