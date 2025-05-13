import { Redirect } from 'expo-router';
import React from 'react';

// This is the root route of your application ("/").
// We are using a Redirect component to automatically navigate
// the user to the default tab screen when they open the app
// or navigate to the root path.
export default function AppRootRedirect() {
  // Redirect to the default tab screen (e.g., the Home tab)
  return <Redirect href="/(tabs)/sessions" />;
}
