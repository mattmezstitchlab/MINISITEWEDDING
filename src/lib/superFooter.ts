/**
 * SUPER FOOTER — LE FOOTER D'UNE PERSONNE, ET LES DOCUMENTS QUI VONT AVEC
 *
 * On garde le design du magasin : des **rayons** qu'on coche, et **un ticket**
 * qui se compose tout seul. Sauf qu'ici, les rayons ne sont pas des objets :
 * ce sont des **situations de vie**. On dit son statut, son parcours, ce qu'on
 * sait faire, ce qu'on veut — et le ticket montre **ce que ça ouvre** : les
 * documents qui existent pour cette situation, qui les demande, au nom de qui
 * ils sont établis, et les pièces qu'il faut avoir.
 *
 * Rien n'est inventé, rien n'est généré ici : on montre **ce qui existe, où le
 * trouver, et ce qu'il faut réunir**. Ce qui relève du droit est signalé comme
 * tel et renvoyé à sa source — la validation revient à des juristes.
 */

/* —————————————————————— LES GRANDS AXES, ET LEURS COUCHES —————————————————————— */

export interface SousEntree {
  id: string;
  label: string;
}

export interface EntreeDeFooter {
  id: string;
  label: string;
  /** Le mot qui explique ce que cette couche ouvre. */
  note?: string;
  entrees: SousEntree[];
}

export interface AxeDeFooter {
  id: string;
  label: string;
  /** La question que l'axe pose. */
  question: string;
  entrees: EntreeDeFooter[];
}

export const AXES_FOOTER: AxeDeFooter[] = [
  {
    id: 'statut',
    label: 'Qui vous êtes',
    question: 'Votre situation, telle qu’elle est aujourd’hui.',
    entrees: [
      {
        id: 'travail',
        label: 'Au travail',
        entrees: [
          { id: 'salarie', label: 'Salarié·e' },
          { id: 'independant', label: 'Indépendant·e' },
          { id: 'intermittent', label: 'Intermittent·e du spectacle' },
          { id: 'dirigeant', label: 'Dirigeant·e de structure' },
          { id: 'benevole', label: 'Bénévole d’association' },
        ],
      },
      {
        id: 'etudes',
        label: 'En études',
        entrees: [
          { id: 'etudiant', label: 'Étudiant·e' },
          { id: 'apprenti', label: 'Apprenti·e' },
          { id: 'formation', label: 'En formation ou reconversion' },
          { id: 'diplome_etranger', label: 'Diplôme obtenu à l’étranger' },
        ],
      },
      {
        id: 'sans_activite',
        label: 'Sans activité',
        entrees: [
          { id: 'recherche', label: 'En recherche d’emploi' },
          { id: 'retraite', label: 'Retraité·e' },
          { id: 'sans_ressource', label: 'Sans ressource' },
          { id: 'heberge', label: 'Hébergé·e par un proche' },
        ],
      },
      {
        id: 'frontieres',
        label: 'Et les frontières',
        entrees: [
          { id: 'etranger_en_france', label: 'Étranger·ère en France' },
          { id: 'expatrie', label: 'Français·e expatrié·e' },
          { id: 'visa', label: 'Besoin d’un visa' },
          { id: 'aller_retour', label: 'Aller-retour régulier' },
        ],
      },
    ],
  },
  {
    id: 'parcours',
    label: 'Ce que vous vivez',
    question: 'Les moments qui changent les papiers.',
    entrees: [
      {
        id: 'union',
        label: 'Union',
        entrees: [
          { id: 'mariage', label: 'Mariage' },
          { id: 'pacs', label: 'PACS' },
          { id: 'union_etrangere', label: 'Union célébrée à l’étranger' },
        ],
      },
      {
        id: 'famille',
        label: 'Famille',
        entrees: [
          { id: 'naissance', label: 'Naissance ou adoption' },
          { id: 'parent_isole', label: 'Parent seul' },
          { id: 'mineur', label: 'Un enfant mineur voyage' },
          { id: 'deces', label: 'Deuil' },
        ],
      },
      {
        id: 'logement',
        label: 'Logement',
        entrees: [
          { id: 'demenagement', label: 'Déménagement' },
          { id: 'hebergeur', label: 'J’héberge quelqu’un' },
          { id: 'locataire', label: 'Locataire' },
          { id: 'proprietaire', label: 'Propriétaire' },
        ],
      },
      {
        id: 'creation',
        label: 'Création',
        entrees: [
          { id: 'association', label: 'Créer une association' },
          { id: 'entreprise', label: 'Créer une activité' },
          { id: 'oeuvre', label: 'Une œuvre, un spectacle, une édition' },
        ],
      },
    ],
  },
  {
    id: 'savoir',
    label: 'Ce que vous savez faire',
    question: 'Ce qui se prouve, et ce qui ne se prouve pas.',
    entrees: [
      {
        id: 'preuves',
        label: 'Ce qui se prouve',
        entrees: [
          { id: 'diplome', label: 'Diplôme ou titre' },
          { id: 'experience', label: 'Expérience professionnelle' },
          { id: 'certification', label: 'Certification ou habilitation' },
          { id: 'langues', label: 'Langues parlées' },
        ],
      },
      {
        id: 'metier',
        label: 'Votre métier',
        entrees: [
          { id: 'metier_art', label: 'Métier d’art ou artisanat' },
          { id: 'metier_spectacle', label: 'Métier du spectacle' },
          { id: 'metier_soin', label: 'Métier du soin ou de l’humain' },
          { id: 'metier_numerique', label: 'Métier du numérique' },
          { id: 'prestataire', label: 'Métier de l’événement' },
        ],
      },
      {
        id: 'transmission',
        label: 'Ce que vous transmettez',
        entrees: [
          { id: 'mentorat', label: 'Mentorat' },
          { id: 'atelier', label: 'Ateliers et formations' },
          { id: 'ecriture', label: 'Écriture et publication' },
        ],
      },
    ],
  },
  {
    id: 'envies',
    label: 'Ce que vous voulez',
    question: 'L’intention, avant la paperasse.',
    entrees: [
      {
        id: 'monde',
        label: 'Le monde',
        entrees: [
          { id: 'voyager', label: 'Voyager et découvrir' },
          { id: 'travailler_ailleurs', label: 'Travailler ailleurs' },
          { id: 'etudier_ailleurs', label: 'Étudier ailleurs' },
          { id: 's_installer', label: 'M’installer ailleurs' },
        ],
      },
      {
        id: 'accueil',
        label: 'Accueillir',
        entrees: [
          { id: 'accueillir', label: 'Accueillir quelqu’un chez moi' },
          { id: 'inviter', label: 'Inviter pour un séjour' },
          { id: 'parrainer', label: 'Parrainer un projet' },
        ],
      },
      {
        id: 'valeurs',
        label: 'Vos valeurs',
        entrees: [
          { id: 'egalite', label: 'Égalité et non-discrimination' },
          { id: 'solidarite', label: 'Solidarité et entraide' },
          { id: 'ecologie', label: 'Écologie et sobriété' },
          { id: 'transmission_v', label: 'Transmission entre générations' },
        ],
      },
    ],
  },
];

/* —————————————————————————— LES DOCUMENTS QUI EXISTENT —————————————————————————— */

export interface DocumentPossible {
  id: string;
  nom: string;
  /** Ce qui ouvre ce document. */
  ouvrePar: string[];
  /** Qui, d'ordinaire, le demande. */
  demandePar: string;
  /** Au nom de qui il est établi. */
  auNomDe: string;
  /** Ce qu'il faut avoir sous la main. */
  pieces: string[];
  /** Là où l'on trouve le modèle ou la règle — à vérifier avant usage. */
  source: string;
  /**
   * **Qui doit valider ce document avant qu'il ne serve.** Rien ici n'est produit
   * par le site : ce qui engage le droit est marqué, et renvoyé à quelqu'un qui a
   * le droit de le dire.
   */
  validation?: 'juriste' | 'notaire';
}

export const DOCUMENTS: DocumentPossible[] = [
  {
    id: 'attestation-hebergement',
    nom: 'Attestation d’hébergement',
    ouvrePar: ['hebergeur', 'accueillir', 'etranger_en_france', 'visa'],
    demandePar: 'Un proche, une préfecture, un organisme',
    auNomDe: 'La personne qui héberge',
    pieces: ['Justificatif de domicile de l’hébergeant', 'Pièce d’identité de l’hébergeant', 'Dates exactes du séjour'],
    source: 'Modèle officiel du formulaire d’attestation d’hébergement (service-public.fr)',
  },
  {
    id: 'lettre-invitation',
    nom: 'Lettre d’invitation pour un visa',
    ouvrePar: ['inviter', 'visa', 'etranger_en_france'],
    demandePar: 'La personne invitée, auprès du consulat',
    auNomDe: 'La personne qui invite',
    pieces: ['Attestation d’hébergement', 'Justificatif de ressources', 'Assurance voyage du visiteur'],
    source: 'Consulat compétent — les pièces exigées varient selon le pays',
  },
  {
    id: 'prise-en-charge',
    nom: 'Attestation de prise en charge',
    ouvrePar: ['inviter', 'visa', 'etudier_ailleurs', 'accueillir', 'voyager'],
    demandePar: 'Un consulat, une école, une assurance',
    auNomDe: 'La personne qui prend en charge',
    pieces: ['Justificatifs de revenus', 'Engagement écrit et daté', 'Pièce d’identité'],
    source: 'Demandeur : consulat ou établissement — modèle fourni par eux',
  },
  {
    id: 'justificatif-domicile',
    nom: 'Justificatif de domicile',
    ouvrePar: ['locataire', 'proprietaire', 'heberge', 'demenagement'],
    demandePar: 'Presque tout le monde : banque, employeur, administration',
    auNomDe: 'La personne qui occupe le logement',
    pieces: ['Quittance, bail, ou facture d’énergie', 'De moins de trois mois, en général'],
    source: 'Liste des justificatifs acceptés : service-public.fr',
  },
  {
    id: 'quittance',
    nom: 'Quittance de loyer',
    ouvrePar: ['locataire', 'demenagement'],
    demandePar: 'Un bailleur ou un locataire',
    auNomDe: 'Le locataire',
    pieces: ['Montant du loyer payé', 'Période couverte'],
    source: 'Obligation et contenu : droit de la location — à confirmer',
  },
  {
    id: 'attestation-employeur',
    nom: 'Attestation employeur',
    ouvrePar: ['salarie', 'intermittent', 'apprenti'],
    demandePar: 'Un organisme, une préfecture, une banque',
    auNomDe: 'L’employeur, pour son salarié',
    pieces: ['Contrat de travail', 'Bulletins de paie', 'Dates de la relation de travail'],
    source: 'Modèle selon l’usage de l’organisme demandeur',
  },
  {
    id: 'attestation-intermittent',
    nom: 'Relevé de droits et attestation de fin de contrat',
    ouvrePar: ['intermittent', 'metier_spectacle'],
    demandePar: 'L’assurance chômage des intermittents, un producteur',
    auNomDe: 'L’artiste ou le technicien',
    pieces: ['Contrats de travail de la période', 'Certificats de travail', 'Bulletins de paie'],
    source: 'Formulaires du régime des intermittents',
    validation: 'juriste',
  },
  {
    id: 'promesse-embauche',
    nom: 'Promesse d’embauche ou contrat de travail',
    ouvrePar: ['salarie', 'recherche', 'travailler_ailleurs', 'certification', 'experience'],
    demandePar: 'Un employeur, un consulat, une banque',
    auNomDe: 'L’employeur et la personne embauchée',
    pieces: ['Poste, lieu, date d’entrée', 'Rémunération', 'Période d’essai'],
    source: 'Droit du travail — le contrat écrit n’est pas toujours obligatoire',
  },
  {
    id: 'attestation-benevolat',
    nom: 'Attestation de bénévolat',
    ouvrePar: ['benevole', 'association', 'solidarite'],
    demandePar: 'Un employeur, une école, une administration',
    auNomDe: 'L’association, pour son bénévole',
    pieces: ['Missions et dates', 'Engagement de l’association'],
    source: 'Modèle libre — aucune forme imposée en général',
  },
  {
    id: 'statuts-association',
    nom: 'Statuts et récépissé de déclaration d’association',
    ouvrePar: ['association', 'benevole'],
    demandePar: 'Une banque, une mairie, un financeur',
    auNomDe: 'L’association',
    pieces: ['Statuts datés et signés', 'Procès-verbal de l’assemblée', 'Liste des dirigeants'],
    source: 'Déclaration en préfecture (ou au greffe) — démarche officielle',
  },
  {
    id: 'devis',
    nom: 'Devis',
    ouvrePar: ['independant', 'oeuvre', 'metier_art', 'entreprise', 'prestataire'],
    demandePar: 'Un client, avant d’engager la dépense',
    auNomDe: 'Celui qui vend la prestation',
    pieces: ['Description, quantités, prix', 'Durée de validité', 'Conditions d’annulation'],
    source: 'Mentions obligatoires selon l’activité',
    validation: 'juriste',
  },
  {
    id: 'facture',
    nom: 'Facture',
    ouvrePar: ['independant', 'oeuvre', 'entreprise', 'prestataire'],
    demandePar: 'Le client, la comptabilité, l’administration',
    auNomDe: 'Celui qui a vendu',
    pieces: ['Numérotation continue', 'TVA ou autoliquidation', 'Délais de paiement et pénalités'],
    source: 'Code de commerce — mentions obligatoires',
    validation: 'juriste',
  },
  {
    id: 'contrat-prestation',
    nom: 'Contrat de prestation',
    ouvrePar: ['independant', 'prestataire', 'oeuvre', 'entreprise'],
    demandePar: 'Celui qui commande, celui qui exécute',
    auNomDe: 'Les deux parties',
    pieces: ['Objet, prix, délai', 'Cession de droits si l’on produit des images ou de la musique', 'Responsabilités'],
    source: 'À adapter à chaque métier',
    validation: 'juriste',
  },
  {
    id: 'cessions-droits',
    nom: 'Autorisation de diffusion et cession de droits',
    ouvrePar: ['oeuvre', 'metier_spectacle', 'association', 'prestataire'],
    demandePar: 'Celui qui diffuse, celui qui publie',
    auNomDe: 'L’auteur ou l’interprète',
    pieces: ['Étendue (lieu, durée, supports)', 'Gratuité ou rémunération', 'Droit moral : jamais cédé'],
    source: 'Code de la propriété intellectuelle',
    validation: 'juriste',
  },
  {
    id: 'autorisation-sortie',
    nom: 'Autorisation de sortie du territoire (mineur)',
    ouvrePar: ['mineur', 'parent_isole', 'aller_retour'],
    demandePar: 'La police, la compagnie, le pays d’arrivée',
    auNomDe: 'Le parent titulaire de l’autorité parentale',
    pieces: ['Formulaire officiel', 'Pièce d’identité du parent', 'Justificatif du lien de parenté'],
    source: 'Formulaire officiel — les règles dépendent de la destination',
  },
  {
    id: 'procuration',
    nom: 'Procuration',
    ouvrePar: ['expatrie', 'aller_retour', 'sans_ressource', 'retraite'],
    demandePar: 'Une administration, une banque',
    auNomDe: 'La personne représentée',
    pieces: ['Objet précis et limité', 'Mandant et mandataire identifiés', 'Souvent : légalisation ou apostille'],
    source: 'Forme libre en principe ; authentique si la loi l’exige',
    validation: 'juriste',
  },
  {
    id: 'acte-mariage',
    nom: 'Copie intégrale ou extrait d’acte de mariage',
    ouvrePar: ['mariage', 'union_etrangere', 'naissance', 'pacs'],
    demandePar: 'Une administration, une banque, un autre pays',
    auNomDe: 'Les personnes mariées',
    pieces: ['Date et lieu exacts du mariage', 'Noms des parents', 'La mairie ou le consulat concerné'],
    source: 'Demande en mairie ou au consulat — un acte étranger se fait souvent transcrire',
  },
  {
    id: 'convention-pacs',
    nom: 'Convention de PACS et attestation d’enregistrement',
    ouvrePar: ['pacs', 'union_etrangere'],
    demandePar: 'Une administration, un employeur, une banque',
    auNomDe: 'Les personnes pacsées',
    pieces: ['Convention signée', 'Attestation du tribunal ou du consulat', 'Actes de naissance'],
    source: 'Enregistrement en mairie ou au consulat — démarche officielle',
  },
  {
    id: 'acte-naissance',
    nom: 'Copie d’acte de naissance',
    ouvrePar: ['naissance', 'mariage', 'visa', 'etudier_ailleurs', 'expatrie', 'mineur'],
    demandePar: 'Presque toutes les administrations, et tout autre pays',
    auNomDe: 'La personne concernée, ou ses parents',
    pieces: ['Date et lieu de naissance', 'Noms des parents', 'Souvent : moins de trois mois, et apostille'],
    source: 'Demande en ligne ou en mairie de naissance',
  },
  {
    id: 'acte-deces',
    nom: 'Acte de décès et attestation de notaire',
    ouvrePar: ['deces'],
    demandePar: 'Une banque, une assurance, un notaire',
    auNomDe: 'La personne décédée, et ses proches',
    pieces: ['Acte de décès', 'Livret de famille ou acte de mariage', 'Coordonnées du notaire en charge'],
    source: 'Mairie du lieu du décès, puis **accompagnement notarial**',
  },
  {
    id: 'testament',
    nom: 'Testament ou donation entre époux',
    ouvrePar: ['deces', 'mariage', 'proprietaire', 'retraite', 'naissance'],
    demandePar: 'Personne, en général : la personne elle-même',
    auNomDe: 'La personne qui organise sa succession',
    pieces: ['Situation familiale', 'Patrimoine', 'Choix des bénéficiaires'],
    source: 'Acte authentique — jamais un modèle libre',
    validation: 'notaire',
  },
  {
    id: 'kbis',
    nom: 'Extrait Kbis ou avis de situation',
    ouvrePar: ['dirigeant', 'entreprise', 'independant', 'prestataire'],
    demandePar: 'Une banque, un client, un marché public',
    auNomDe: 'La structure',
    pieces: ['Numéro SIREN', 'Adresse du siège', 'Objet et dirigeants'],
    source: 'Registre officiel (INPI / greffe) — l’extrait se télécharge directement',
  },
  {
    id: 'diplome-copie',
    nom: 'Copie de diplôme ou de titre professionnel',
    ouvrePar: ['diplome', 'experience', 'certification', 'metier_soin', 'metier_numerique', 'metier_art', 'apprenti'],
    demandePar: 'Un employeur, une école, un ordre professionnel',
    auNomDe: 'La personne diplômée',
    pieces: ['Copie certifiée conforme si l’original est exigé', 'Relevé de notes', 'Intitulé exact du titre'],
    source: 'Délivré par l’établissement ou l’autorité qui a certifié',
  },
  {
    id: 'comparabilite',
    nom: 'Attestation de comparabilité d’un diplôme étranger',
    ouvrePar: ['diplome_etranger', 'etudier_ailleurs', 'expatrie', 's_installer'],
    demandePar: 'Un employeur, une école, une administration en France',
    auNomDe: 'La personne qui a obtenu le diplôme',
    pieces: ['Diplôme original et traduction', 'Relevés de notes', 'Programme suivi'],
    source: 'Organisme officiel de reconnaissance des diplômes — **délai long, à anticiper**',
  },
  {
    id: 'attestation-formation',
    nom: 'Attestation de formation ou de fin de stage',
    ouvrePar: ['formation', 'apprenti', 'etudiant', 'atelier', 'mentorat'],
    demandePar: 'Un employeur, une école, un financeur',
    auNomDe: 'L’organisme de formation, pour la personne formée',
    pieces: ['Dates et volume horaire', 'Contenu et objectifs', 'Résultat obtenu'],
    source: 'Modèle fourni par l’organisme ; mentions de financement si CPF ou OPCO',
  },
  {
    id: 'convention-stage',
    nom: 'Convention de stage ou d’alternance',
    ouvrePar: ['etudiant', 'apprenti', 'formation'],
    demandePar: 'L’école, l’employeur, l’étudiant',
    auNomDe: 'L’école, l’entreprise et la personne en stage',
    pieces: ['Dates de la période', 'Missions confiées', 'Gratification prévue'],
    source: 'Cadre légal du stage — contenu encadré',
    validation: 'juriste',
  },
  {
    id: 'certification-langue',
    nom: 'Certification de langue',
    ouvrePar: ['langues', 'travailler_ailleurs', 'etudier_ailleurs', 'expatrie', 's_installer'],
    demandePar: 'Une université, un employeur, un service d’immigration',
    auNomDe: 'La personne qui passe l’examen',
    pieces: ['Niveau visé', 'Score obtenu', 'Validité limitée dans le temps'],
    source: 'Organismes certificateurs officiels (DELF/DALF, TOEFL, IELTS…) selon le pays',
  },
  {
    id: 'droits-auteur',
    nom: 'Bulletin d’adhésion et relevé de droits d’auteur',
    ouvrePar: ['oeuvre', 'ecriture', 'metier_spectacle', 'atelier'],
    demandePar: 'Une société de perception, un éditeur, un producteur',
    auNomDe: 'L’autrice ou l’auteur',
    pieces: ['Œuvres déclarées', 'Dates de création ou de diffusion', 'Contrats et cessions'],
    source: 'Sociétés d’auteurs selon la discipline — **la chaîne des droits se vérifie au cas par cas**',
  },
  {
    id: 'assurance-rcp',
    nom: 'Attestation d’assurance responsabilité civile',
    ouvrePar: ['prestataire', 'independant', 'association', 'proprietaire', 'benevole'],
    demandePar: 'Un client, un lieu, une mairie, un bailleur',
    auNomDe: 'La personne ou la structure assurée',
    pieces: ['Numéro de contrat', 'Activités couvertes', 'Dates de validité'],
    source: 'Fournie par l’assureur — vérifier que l’activité exercée est bien couverte',
  },
  {
    id: 'titre-sejour',
    nom: 'Titre de séjour, récépissé ou attestation de demande',
    ouvrePar: ['etranger_en_france', 'visa', 'sans_ressource', 'heberge'],
    demandePar: 'Un employeur, une banque, une administration',
    auNomDe: 'La personne concernée',
    pieces: ['Titre en cours ou récépissé', 'Justificatif de domicile', 'Photos et formulaires préfectoraux'],
    source: 'Préfecture compétente — les pièces demandées varient selon le titre',
  },
  {
    id: 'attestation-honneur',
    nom: 'Attestation sur l’honneur',
    ouvrePar: ['recherche', 'sans_ressource', 'heberge', 'etudiant'],
    demandePar: 'Une administration, un employeur, une école',
    auNomDe: 'La personne qui déclare',
    pieces: ['Objet exact de la déclaration', 'Date et lieu', 'Signature'],
    source: 'Engage la personne qui la signe — une fausse déclaration est sanctionnée',
  },
];

/* —————————————————————————— CE QUE LE FOOTER PORTE —————————————————————————— */

/** Les lignes qu'un footer peut porter : on les coche, elles apparaissent. */
export const LIGNES_FOOTER: Array<{ id: string; label: string; note: string }> = [
  { id: 'mentions', label: 'Mentions légales', note: 'Éditeur, hébergeur, contact' },
  { id: 'statut', label: 'Statut et licence', note: 'Association, entreprise, intermittent, bénévole' },
  { id: 'documents', label: 'Documents disponibles', note: 'Ce qu’on peut vous demander, et ce qui est prêt' },
  { id: 'credits', label: 'Crédits', note: 'Photos, musique, textes — qui a fait quoi' },
  { id: 'valeurs', label: 'Valeurs', note: 'Ce à quoi l’on ne déroge pas' },
  { id: 'langues', label: 'Langues', note: 'Dans quelles langues on peut écrire' },
  { id: 'accessibilite', label: 'Accessibilité', note: 'Ce qui est prévu pour être lisible par tous' },
  { id: 'ecologie', label: 'Écologie', note: 'Ce qu’on a allégé, et pourquoi' },
];

/* ———————————————————————————— CE QUI SE COCHE ———————————————————————————— */

export interface ChoixDeFooter {
  /** Les sous-entrées cochées, tous axes confondus. */
  options: string[];
  /** Les lignes du footer cochées. */
  lignes: string[];
}

export const CHOIX_VIDE: ChoixDeFooter = { options: [], lignes: ['mentions'] };

/** Bascule une coche, dans une liste. */
export function basculer(liste: string[], id: string): string[] {
  return liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id];
}

/**
 * LES DOCUMENTS QUI S'OUVRENT — ce que les coches font apparaître.
 *
 * On ne montre que ce qui **existe** : chaque document dit qui le demande,
 * au nom de qui il est établi, et les pièces qu'il faut avoir. Ce qui relève du
 * droit porte sa source, et se fait valider.
 */
export function documentsOuverts(choix: ChoixDeFooter): DocumentPossible[] {
  if (choix.options.length === 0) return [];
  return DOCUMENTS.filter((d) => d.ouvrePar.some((o) => choix.options.includes(o)));
}

/** Les documents d'un axe, quand on veut les lire par famille. */
export function documentsParAxe(choix: ChoixDeFooter): Array<{ axe: AxeDeFooter; documents: DocumentPossible[] }> {
  const ouverts = documentsOuverts(choix);
  return AXES_FOOTER.map((axe) => {
    const ids = axe.entrees.flatMap((e) => e.entrees.map((s) => s.id));
    return { axe, documents: ouverts.filter((d) => d.ouvrePar.some((o) => ids.includes(o))) };
  }).filter((bloc) => bloc.documents.length > 0);
}

/** Les lignes du ticket : ce que la situation ouvre, écrit comme au magasin. */
export function lignesDuTicket(choix: ChoixDeFooter): Array<{ gauche: string; droite: string }> {
  return documentsOuverts(choix).map((d) => ({ gauche: d.nom, droite: d.demandePar }));
}

/**
 * L'ÉTAT D'UN DOCUMENT, tel qu'on le lit sur le ticket : rien n'est produit tout
 * seul, la personne rassemble, et ce qui engage le droit se valide.
 */
export function etatDuDocument(doc: DocumentPossible): 'à réunir' | 'à valider' {
  return doc.validation ? 'à valider' : 'à réunir';
}

/** Le mot juste, quand il faut dire qui valide. */
export function validationDuDocument(doc: DocumentPossible): string | null {
  if (doc.validation === 'notaire') return 'À faire établir par un notaire';
  if (doc.validation === 'juriste') return 'À faire valider par un juriste';
  return null;
}
