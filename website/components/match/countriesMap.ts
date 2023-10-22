// countriesMap.ts

export const getArticleByGender = (teamId: string, teams: Record<string, any>) => {
    return teams[teamId]?.pronoun || 'le';
};

export const getArticleWithApostrophe = getArticleByGender;

export const getTranslatedCountry = (teamId: string, teams: Record<string, any>) => teams[teamId]?.french_name || teamId;

export const getTranslatedCountryPossessive = (teamId: string, teams: Record<string, any>) => {
    const translatedCountry = getTranslatedCountry(teamId, teams);
    
    if (teams[teamId]?.name.includes("'")) {
        return `l'${translatedCountry}`;
    }
    return `${getArticleByGender(teamId, teams)} ${translatedCountry}`;
};
