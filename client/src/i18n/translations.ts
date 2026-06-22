export const translations = {
  fr: {
    home_subtitle: 'Trouvez le film parfait à regarder ensemble.',
    home_createTab: 'Créer',
    home_joinTab: 'Rejoindre',

    create_country: 'Pays',
    create_mediaType: 'Type de contenu',
    create_groupSize: 'Nombre de participants',
    create_majorityHint: 'Un "Match" apparaîtra dès que la majorité du groupe ({threshold} sur {groupSize}) aime le même {media}.',
    create_button: 'Créer une session',
    create_movieWord: 'film',
    create_tvWord: 'série',

    join_button: 'Rejoindre la session',

    error_generic: 'Une erreur est survenue.',
    error_loadFailed: 'Impossible de charger les films pour le moment.',
    error_code_generation_failed: 'Impossible de générer un code de session disponible, réessaie.',
    error_invalid_code: 'Le code doit contenir 4 chiffres.',
    error_session_not_found: 'Aucune session ne correspond à ce code.',
    error_session_full: 'Cette session est déjà complète.',

    platforms_codeLabel: 'Code de session : {code}',
    platforms_waiting: 'En attente des autres participants… ({ready}/{total} prêts)',
    platforms_instructions: 'Sélectionnez vos plateformes de streaming :',
    platforms_genresInstructions: "Genres (optionnel — utile si vous êtes d'accord) :",
    platforms_continue: 'Continuer',

    swipe_subtitleMovie: 'Swipez pour trouver votre film.',
    swipe_subtitleTv: 'Swipez pour trouver votre série.',
    swipe_noCommonPlatforms: "Vous n'avez aucune plateforme en commun pour l'instant.",
    swipe_genreConflict:
      "Vous n'avez choisi aucun genre en commun — essayez d'en sélectionner un que vous partagez tous les deux.",

    deck_empty: 'Plus rien de disponible sur vos plateformes communes pour l’instant.',

    card_synopsis: 'Synopsis',
    card_like: "J'AIME",
    card_pass: 'PASSE',
    card_noOverview: 'Pas de synopsis disponible.',

    match_title: "C'est un Match !",
    match_restart: 'Nouvelle session',

    notFound_text: 'Page introuvable.',
    notFound_back: "Retour à l'accueil",

    attribution_text: "Ce produit utilise l'API TMDB mais n'est pas approuvé ou certifié par TMDB.",
  },
  en: {
    home_subtitle: 'Find the perfect movie to watch together.',
    home_createTab: 'Create',
    home_joinTab: 'Join',

    create_country: 'Country',
    create_mediaType: 'Content type',
    create_groupSize: 'Number of participants',
    create_majorityHint: 'A "Match" will appear once a majority of the group ({threshold} of {groupSize}) likes the same {media}.',
    create_button: 'Create a session',
    create_movieWord: 'movie',
    create_tvWord: 'show',

    join_button: 'Join the session',

    error_generic: 'Something went wrong.',
    error_loadFailed: 'Could not load movies right now.',
    error_code_generation_failed: 'Could not generate an available session code, try again.',
    error_invalid_code: 'The code must be 4 digits.',
    error_session_not_found: 'No session matches this code.',
    error_session_full: 'This session is already full.',

    platforms_codeLabel: 'Session code: {code}',
    platforms_waiting: 'Waiting for the rest of the group… ({ready}/{total} ready)',
    platforms_instructions: 'Select your streaming platforms:',
    platforms_genresInstructions: 'Genres (optional — useful if you all agree):',
    platforms_continue: 'Continue',

    swipe_subtitleMovie: 'Swipe to find your movie.',
    swipe_subtitleTv: 'Swipe to find your show.',
    swipe_noCommonPlatforms: "You don't have any streaming platform in common yet.",
    swipe_genreConflict: "You haven't picked a genre in common — try selecting one you all share.",

    deck_empty: 'Nothing left available on your shared platforms right now.',

    card_synopsis: 'Synopsis',
    card_like: 'LIKE',
    card_pass: 'NOPE',
    card_noOverview: 'No synopsis available.',

    match_title: "It's a Match!",
    match_restart: 'New session',

    notFound_text: 'Page not found.',
    notFound_back: 'Back to home',

    attribution_text: 'This product uses the TMDB API but is not endorsed or certified by TMDB.',
  },
} as const

export type TranslationKey = keyof typeof translations.fr
