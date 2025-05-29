const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    next: "Next",
    male: "Male",
    female: "Female",
    done: "Done",
  },
  welcomeScreen: {
    title: "The basics.",
    titleDescription:
      "MAGE takes into account your details to make adjustments for the best results.",
    dateOfBirth: "Date of Birth",
    height: "Height",
    weight: "Weight",
    gender: "Gender",
  },
  measurementsScreen: {
    title: "Life factors.",
    subtitle1: "Experience",
    subtitle2: "Diet",
    subtitle3: "Sleep",
    subtitle4: "Activity",
    question1: "How many years you have trained consistently ?",
    question2: "How well do you fuel your workouts?",
    question3: "How many hours do you sleep per night?",
    question4: "What is your activity level outside of training?",
  },
  lifeContinuedScreen: {
    title: "Sport.",
    description: "What sport or type of workouts will be focused on? Not sure? Choose general.",
    category1: "Powerlifting",
    category2: "Strongman",
    category3: "Olympic Weightlifting",
    category4: "Bodybuilding",
    category5: "General",
  },
  equipmentScreen: {
    title: "Equipment.",
    description: "What equipment will you have access to? You can choose more than one.",
    category1: "Commercial Gym",
    category2: "Crossfit Gym",
    category3: "Minimal at Home Setup ",
    category4: "Strongman Gym",
    category5: "Oly Gym",
    category6: "Powerlifting Gym",
  },
  goalsScreen: {
    title: "Your goals.",
    description:
      "This is a place you can set goals for your primary lifts. Setting good goals can increase your chance of success",
    category1: "Squats",
    category2: "Bench",
    category3: "Deadlift",
    category4: "General",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    welcome: "Welcome back.",
    emailFieldLabel: "Email or Username",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address or username",
    passwordFieldPlaceholder: "Super secret password here",
    login: "Login",
    loginToYourAccournt: "Login to your account.",
    signUp: "Create account",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  signUpScreen: {
    welcome: "Welcome to the Mage App.",
    first: "First name",
    last: "Last name",
    userName: "Username",
    userNamePlaceholder: " Enter your username",
    email: "Email",
    emailPlaceholder: "Enter email adress",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    passwordConf: "Confirm password",
    passwordConfLabel: "Repeat password",
    signUp: "Create account",
    day: "Day",
    month: "Month",
    year: "Year",
  },
  demoNavigator: {
    homeTab: "Home",
    chatTab: "Chat",
    settingsTab: "Settings",
    exerciseTab: "Exercise",
  },
  home: {
    title: "Progress reports",
    subtitle: "Look how far you have come",
    settingsTab: "Settings",
    exerciseTab: "Exercise",
    mageProgramTopDescription:
      "Fill out the questions below and combined with the information you have already provided us. We will build you a custom program.",
    mageProgramBottomDescription:
      "For quality assurance. We have an extra set of eyes look over the mages work before sending it to you, This will be done within 24 hours. ",
    question1: "How many sessions per week will you be training?",
    question2: "What would you like to focus on?",
    question3:
      "What sort of training have you enjoyed/ got good results from in the past? ( If you do not know, Put balanced )",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Welcome to the Mage App",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },
  forgotPasswordScreen: {
    title: "Forgot Password",
    description1:
      "Please, enter your username and we will send a code to your email to reset your password",
    description2: "Please, enter the code you received via email to create a new password",
    description3: "Please, enter your new password and reenter to confirm. ",
    fieldPlaceholder: {
      username: "Username for recovery",
      email: "Email for recovery",
      code: "Code",
      newPassword: "New password",
      confirmPassford: "Confirm  password",
    },
    buttons: {
      send: "Send",
      confirm: "Confirm",
      resetPassword: "Reset Password",
    },
  },
  reportProblemsScreen: {
    header: "Report Problem",
    inputs: {
      problem: "What is the problem",
      detail: "More Detail",
    },
    buttons: {
      send: "Send",
    },
  },
  preBlockMaxes: {
    card: {
      header: "Welcome to your new block of training.",
      content:
        " Below are your beginning maxes we will be working off . This is the time to adjust them. But don’t worry if you don’t know them. We will change them as we go.",
    },
    buttons: {
      startProgram: "Start Program",
    },
  },
}

export default en
export type Translations = typeof en
