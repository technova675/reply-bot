# **App Name**: ChirpFeed

## Core Features:

- Tweet Feed Display: Display a list of tweets in a card-based layout, similar to Twitter/X.
- Top Bar: Display a top bar with a logo, a 'Create' button, and a user avatar.
- Sidebar Navigation: Implement a sidebar for navigation that collapses on smaller screens.
- Tweet Card: Display each tweet in a card format with author information, timestamp, text, media, and action icons.
- Static Data Loading: Load tweet data from a local JSON file (src/data/tweets.json).
- Data Debug Tool: Provide a debug overlay to visualize the data being consumed. Hotkey toggle by pressing the `~` key.

## Style Guidelines:

- Primary color: Slightly desaturated, dark violet (#4A274F), evoking a calm, modern feel on the Twitter/X color scheme.
- Background color: Very dark purple (#12121A) for a nearly-black dark theme.
- Accent color: Desaturated light purple (#B497C6), providing visual contrast for interactive elements and highlights.
- Body text: 'Inter' (sans-serif) for body text, providing a clean, neutral, modern aesthetic. Headline: 'Space Grotesk' (sans-serif) giving a techy/scientific aesthetic.
- Use a set of simple, outlined icons for the sidebar and tweet actions, maintaining a clean and consistent aesthetic.
- Implement a responsive layout with a wide feed column and a thin left navigation, adapting to single-column on small screens and grid layout on larger screens.
- Incorporate subtle hover glows and transitions for interactive elements to provide a calm, developer-friendly user experience.