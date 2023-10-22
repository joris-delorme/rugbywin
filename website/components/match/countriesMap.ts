// countriesMap.ts

export type Team = {
    french_name: string;
    name: string;
    pronoun: string;
    unicode: string;
};

export const getArticleByGender = (teamId: string, teams: Record<string, Team>) => {
    return teams[teamId]?.pronoun || 'le';
};

export const getTranslatedCountry = (teamId: string, teams?: Record<string, Team>) => {
    if (!teams || !teamId) return teamId;
    return teams[teamId]?.french_name || teamId;
 };
 
export const getTranslatedCountryPossessive = (teamId: string, teams: Record<string, Team>) => {
    const translatedCountry = getTranslatedCountry(teamId, teams);
    
    // This logic might not be correct based on the given context. 
    // So, either remove or modify it as per the exact requirements.
    if (translatedCountry.includes("'")) {
        return `l'${translatedCountry}`;
    }
    
    return `${getArticleByGender(teamId, teams)} ${translatedCountry}`;
};
