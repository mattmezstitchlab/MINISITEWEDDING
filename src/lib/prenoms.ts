/**
 * CE QUE LES PRÉNOMS VEULENT DIRE — LA COUCHE QUI COUVRE L'ANNÉE
 *
 * Sur les 364 jours nommés du calendrier, un peu plus de deux cents portent un
 * **prénom** dont l'étymologie est documentée par les dictionnaires courants.
 * C'est la première couche de la fiche : elle existe pour **tout le monde**, elle
 * est citée, et elle ne prétend rien d'autre que ce qu'elle est — le sens d'un
 * nom, transmis, pas une histoire inventée.
 *
 * ## La règle, tenue ici comme ailleurs
 *
 * Cette liste est **volontairement incomplète**. Ce qui n'y est pas n'est pas
 * « à peu près » : c'est **à documenter**, et la fiche le dira. Un prénom dont
 * l'étymologie est discutée le dit aussi (« sens discuté ») — on ne tranche pas
 * ce que les dictionnaires ne tranchent pas.
 *
 * Source : les dictionnaires de prénoms courants et les listes d'étymologie
 * transmises (voir `SIGNIFICATION_SOURCE` dans `profilsEditoriaux.ts`).
 */

/** `Nom | ce que le prénom veut dire.` — un par ligne. */
const TABLE = `
Abel | de l’hébreu hevel : « souffle, buée ».
Achille | du grec Achilleus, le héros de l’Iliade.
Adèle | du germanique adal : « noble ».
Adeline | du germanique adal : « noble ».
Adelphe | du grec adelphos : « frère ».
Agathe | du grec agathos : « bon ».
Agnès | du grec hagnê : « pure, chaste ».
Aimé | du latin amatus : « aimé ».
Aimée | du latin amata : « aimée ».
Alain | du breton, « rocher » — sens discuté.
Albert | du germanique adal (noble) et behrt (brillant) : « noble et brillant ».
Alexandre | du grec alexein (repousser) et andros (homme) : « qui protège les hommes ».
Alexis | du grec alexein : « repousser, protéger ».
Alice | du germanique adal (noble) et heid : « de noble espèce ».
Alix | variante d’Adélaïde, du germanique adal : « noble ».
Alphonse | du germanique adal (noble) et funs (vif) : « noble et vif ».
Amandine | du latin amandus : « qui doit être aimé ».
Ambroise | du grec ambrotos : « immortel ».
Amédée | du latin ama Deus : « aimé de Dieu ».
Amour | du latin amor : « amour ».
André | du grec andros : « homme ».
Angèle | du grec aggelos : « messager ».
Anne | de l’hébreu hannah : « grâce ».
Anselme | du germanique ans (dieu) et helm (heaume) : « protégé des dieux ».
Anthelme | du germanique ans (dieu) et helm (heaume).
Apollinaire | du latin, « relatif à Apollon ».
Apolline | du grec Apollon, le dieu de la lumière.
Aristide | du grec aristos : « le meilleur ».
Armand | du germanique hart (fort) et man (homme) : « homme fort ».
Arnaud | du germanique arn (aigle) et wald (gouverner) : « l’aigle qui gouverne ».
Arsène | du grec arsen : « mâle, viril ».
Aubin | du latin albus : « blanc ».
Audrey | de l’anglo-saxon aethel (noble) et thryth (force).
Augustin | du latin augustus : « vénérable ».
Barbara | du latin barbara : « étrangère ».
Barnabé | de l’hébreu bar naba : « fils de la consolation ».
Barnard | du germanique ber (ours) et hard (dur) : « ours hardi ».
Barthélemy | de l’hébreu bar tolmaï : « fils de Tolmaï ».
Basile | du grec basileus : « roi ».
Baudoin | du germanique bald (audacieux) et win (ami).
Béatrice | du latin beata : « bienheureuse ».
Bénédicte | du latin benedictus : « bénie ».
Benjamin | de l’hébreu binyamin : « fils de la droite ».
Benoît-Joseph | du latin benedictus (béni) et de l’hébreu yosef (il ajoutera).
Bernadette | forme de Bernard, du germanique ber (ours) et hard (dur).
Bernard | du germanique ber (ours) et hard (dur) : « ours hardi ».
Bernardin | de Bernard, du germanique ber et hard.
Bertille | du germanique behrt (brillant) et hild (combat) : « brillante au combat ».
Bertrand | du germanique behrt (brillant) et hramn (corbeau).
Bienvenue | le mot lui-même, donné comme prénom.
Blaise | du latin blaesus : « qui bégaye ».
Blandine | du latin blandus : « caressant, doux ».
Brigitte | du gaélique brig : « force, altitude ».
Bruno | du germanique brun : « le brun » — ou la cuirasse.
Carine | variante de Catherine, du grec katharos : « pure ».
Casimir | du slave kazac (ordonner) et mir (paix) : « qui impose la paix ».
Catherine | du grec katharos : « pur ».
Cécile | du latin caecus : « aveugle » — et le nom de la famille romaine des Caecilii.
Céline | du latin caelum : « ciel ».
Charles | du germanique karl : « homme libre, fort ».
Christian | du latin christianus : « chrétien ».
Christine | du grec christos : « oint ».
Christophe | du grec christophoros : « qui porte le Christ ».
Claire | du latin clara : « claire, lumineuse ».
Clarisse | de Claire, du latin clara.
Claude | du latin claudus : « boiteux ».
Clémence | du latin clementia : « indulgence ».
Clément | du latin clemens : « indulgent ».
Clotilde | du germanique hlod (gloire) et hild (combat) : « gloire au combat ».
Colette | diminutif de Nicole, du grec nikê (victoire) et laos (peuple).
Constant | du latin constans : « constant ».
Constantin | du latin constans : « constant ».
Côme | du grec kosmos : « ordre, beauté ».
Crépin | du latin crispus : « crépu ».
Cyrille | du grec kyrios : « seigneur ».
Damien | du grec daman : « dompter ».
Daniel | de l’hébreu daniyyel : « Dieu est mon juge ».
David | de l’hébreu dawid : « bien-aimé ».
Davy | de David, de l’hébreu dawid : « bien-aimé ».
Delphine | du latin delphinus : « dauphin ».
Denis | du grec Dionysos, le dieu du théâtre et du vin.
Denise | féminin de Denis, du grec Dionysos.
Diane | du latin Diana, la déesse de la chasse.
Didier | du latin desiderius : « désiré ».
Dimitri | du grec Demeter, la déesse de la terre.
Dominique | du latin dominicus : « du Seigneur ».
Donald | du gaélique : « chef du monde ».
Donatien | du latin donatus : « donné ».
Edith | de l’anglo-saxon ead (richesse) et gyth (combat).
Edmond | de l’anglo-saxon ead (richesse) et mund (protection).
Édouard | du germanique ead (richesse) et weard (gardien) : « gardien de la richesse ».
Edwige | du germanique hadu (combat) et wig (combat).
Élisabeth | de l’hébreu, « mon Dieu est serment ».
Élisée | de l’hébreu elisha : « Dieu est salut ».
Éloi | du latin Eligius : « l’élu ».
Élodie | du germanique, « richesse venue d’ailleurs » — sens discuté.
Émeline | du germanique amal : « puissante ».
Émile | du latin aemulus : « le rival ».
Émilie | du latin aemula : « la rivale ».
Emma | du germanique ermen : « universelle ».
Éric | du vieux norrois eirikr : « toujours roi ».
Estelle | du latin stella : « étoile ».
Étienne | du grec stephanos : « couronne ».
Eugénie | du grec eugenes : « bien-née ».
Fabrice | du latin faber : « artisan, forgeron ».
Félix | du latin felix : « heureux ».
Félicité | du latin felicitas : « bonheur ».
Ferdinand | du germanique frid (paix) et nanth (audace) : « audacieux pour la paix ».
Fernand | du germanique frid (paix) et nanth (audace).
Fiacre | de l’irlandais Fiachra — le nom de l’ermite, avant le fiacre.
Fidèle | du latin fidelis : « fidèle ».
Firmin | du latin firmus : « ferme ».
Fleur | du latin flos : « fleur ».
Flora | du latin flos : « fleur ».
Florence | du latin florens : « florissante ».
Florentin | du latin florens : « florissant ».
François | du latin Franciscus : « de France, du pays des Francs ».
Françoise | féminin de François, du latin Franciscus.
Françoise-Xavière | de François et de Xavier, du basque « maison neuve ».
Frédéric | du germanique frid (paix) et rik (puissant) : « puissant par la paix ».
Fulbert | du germanique folk (peuple) et behrt (brillant).
Gabin | du latin Gabinus : « de Gabies ».
Gaël | du breton et du gaélique, « celui qui parle gaélique ».
Gaétan | du latin Caietanus : « de Gaète ».
Gaston | du germanique gast : « hôte ».
Gatien | du latin Gatianus, nom du premier évêque de Tours.
Gautier | du germanique wald (gouverner) et hari (armée).
Geneviève | du germanique gena (famille) et wifa (femme) : « femme de la famille ».
Geoffroy | du germanique gaut (goth) et frid (paix).
Georges | du grec georgos : « travailleur de la terre ».
Gérald | du germanique ger (lance) et wald (gouverner).
Gérard | du germanique ger (lance) et hard (dur).
Géraud | du germanique ger (lance) et wald (gouverner).
Germain | du latin germanus : « frère, de même sang ».
Germaine | du latin germanus : « sœur, de même sang ».
Gilbert | du germanique gisil (gage) et behrt (brillant).
Gilles | du grec aigidios : « chevreau » — ou du latin Aegidius.
Gisèle | du germanique gisil : « gage, otage de haut rang ».
Gontran | du germanique gund (combat) et hramn (corbeau).
Grégoire | du grec gregoros : « qui veille ».
Guénolé | du breton gwenn : « blanc, sacré ».
Guillaume | du germanique wil (volonté) et helm (heaume) : « volonté de protection ».
Guy | du germanique witu : « bois, forêt ».
Habib | de l’arabe habib : « bien-aimé ».
Hélène | du grec helenê : « éclat du soleil ».
Henri | du germanique heim (maison) et rik (puissant) : « maître de sa maison ».
Herbert | du germanique hari (armée) et behrt (brillant).
Hermann | du germanique hari (armée) et man (homme).
Hervé | du breton, « ardent au combat ».
Hippolyte | du grec hippos (cheval) et lyein (délier) : « qui délie les chevaux ».
Honoré | du latin honoratus : « honoré ».
Honorine | du latin honor : « honneur ».
Hubert | du germanique hugu (esprit) et behrt (brillant).
Hugues | du germanique hugu : « esprit, intelligence ».
Hyacinthe | du grec hyakinthos, la fleur.
Ida | du germanique id : « travail, labeur ».
Ignace | du latin ignis : « feu ».
Igor | du norrois Ingvar : « guerrier d’Ing ».
Inès | variante d’Agnès, du grec hagnê : « pure ».
Ingrid | du norrois Ing et frid : « belle comme le dieu Ing ».
Irène | du grec eirênê : « paix ».
Irénée | du grec eirênê : « paix ».
Isabelle | variante d’Élisabeth, de l’hébreu « mon Dieu est serment ».
Isidore | du grec Isis et doron : « don d’Isis ».
Jacqueline | féminin de Jacques, de l’hébreu ya’aqov.
Jacques | de l’hébreu ya’aqov : « celui qui supplante ».
Jean | de l’hébreu Yochanan : « Dieu fait grâce ».
Jean-Eudes | de Jean, de l’hébreu Yochanan, et d’Eudes, du germanique od (richesse).
Jean-Marie | de Jean, de l’hébreu Yochanan, et de Marie.
Jeanne-Françoise | de Jean, de l’hébreu Yochanan, et de François.
Jérôme | du grec hieros (sacré) et onoma (nom) : « nom sacré ».
Joseph | de l’hébreu yosef : « il ajoutera ».
Jude | de l’hébreu yehudah : « loué ».
Judith | de l’hébreu yehudit : « la Juive », ou « louée ».
Jules | du latin Julius, le nom de famille romaine.
Julien | du latin Julianus, de la famille des Jules.
Julienne | du latin Julianus, de la famille des Jules.
Julie | du latin Julia, le nom de famille romaine.
Juliette | du latin Julia, le nom de famille romaine.
Justin | du latin justus : « juste ».
Justine | du latin justus : « juste ».
Juste | du latin justus : « juste ».
Karine | variante de Catherine, du grec katharos : « pure ».
Kévin | de l’irlandais caoimhín : « beau de naissance ».
Landry | du germanique land (pays) et rik (puissant).
Larissa | du grec, de Larissa, ville de Thessalie.
Laurent | du latin laurus : « laurier ».
Lazare | de l’hébreu Eléazar : « Dieu a secouru ».
Léa | de l’hébreu le’ah — sens discuté.
Léger | du germanique liut (peuple) et gari (lance).
Léon | du latin leo : « lion ».
Léonce | du latin leo : « lion ».
Lucien | du latin lux : « lumière ».
Lucie | du latin lux : « lumière ».
Luc | du latin lux : « lumière ».
Louis | du germanique hlod (gloire) et wig (combat) : « glorieux au combat ».
Louise | du germanique hlod (gloire) et wig (combat).
Lydie | du grec, de Lydie, la région d’Asie mineure.
Marc | du latin Marcus, rattaché à Mars.
Marcel | du latin Marcellus, diminutif de Marcus.
Marcelle | du latin Marcellus, diminutif de Marcus.
Marcellin | du latin Marcellus, diminutif de Marcus.
Marguerite | du latin margarita : « perle ».
Marie-Madeleine | de Myriam, et de Magdala, le village.
Mariette | diminutif de Marie — et Myriam, de l’hébreu, a un sens discuté.
Marius | du latin Marius, rattaché à Mars.
Marina | du latin marinus : « de la mer ».
Marthe | de l’araméen : « dame, maîtresse de maison ».
Martial | du latin Martialis, rattaché à Mars.
Martine | du latin Martinus, rattaché à Mars.
Mathilde | du germanique maht (force) et hild (combat) : « force au combat ».
Matthias | de l’hébreu mattityahu : « don de Dieu ».
Matthieu | de l’hébreu mattityahu : « don de Dieu ».
Maurice | du latin maurus : « maure, brun ».
Maxime | du latin maximus : « le plus grand ».
Médard | du germanique magin (force) et hard (dur).
Michel | de l’hébreu mika’el : « qui est comme Dieu ? ».
Modeste | du latin modestus : « modéré ».
Monique | origine discutée — peut-être du libyque, « la seule ».
Nadège | du russe nadejda : « espérance ».
Narcisse | du grec narkissos, la fleur.
Natacha | diminutif russe de Natalia.
Nathalie | du latin natalis : « jour de naissance ».
Nestor | du grec Nestor, le roi de Pylos chez Homère.
Nicolas | du grec nikê (victoire) et laos (peuple) : « victoire du peuple ».
Ninon | diminutif d’Anne, de l’hébreu hannah : « grâce ».
Norbert | du germanique : « brillant du nord ».
Odette | du germanique od : « richesse ».
Odile | du germanique od : « richesse ».
Olivier | du latin oliva : « olivier ».
Olive | du latin oliva : « olive ».
Pacôme | du grec pakhom, « large d’épaules » — sens discuté.
Parfait | du latin perfectus : « achevé ».
Pascal | du latin paschalis : « de Pâques ».
Paterne | du latin paternus : « paternel ».
Patrice | du latin patricius : « patricien ».
Paule | du latin paulus : « petite, modeste ».
Pauline | du latin paulus : « petite, modeste ».
Pélagie | du grec pelagos : « mer ».
Perrine | féminin de Pierre, du grec petros : « pierre ».
Philippe | du grec philos (ami) et hippos (cheval) : « qui aime les chevaux ».
Pierre | du grec petros : « pierre ».
Prisca | du latin priscus : « ancienne ».
Prosper | du latin prosper : « heureux ».
Prudence | du latin prudentia : « prudence ».
Quentin | du latin Quintinus, de quintus : « cinquième ».
Raoul | du germanique rad (conseil) et wolf (loup) : « conseil du loup ».
Raymond | du germanique ragin (conseil) et mund (protection).
Reine | du latin regina : « reine ».
Rémi | du latin Remigius, de remex : « rameur ».
Renaud | du germanique ragin (conseil) et wald (gouverner).
René | du latin renatus : « né de nouveau ».
Richard | du germanique rik (puissant) et hard (dur) : « puissant et dur ».
Robert | du germanique hrod (gloire) et behrt (brillant) : « brillant de gloire ».
Rodolphe | du germanique hrod (gloire) et wolf (loup).
Rodrigue | du germanique hrod (gloire) et rik (puissant).
Roger | du germanique hrod (gloire) et gari (lance).
Roland | du germanique hrod (gloire) et land (pays).
Rolande | du germanique hrod (gloire) et land (pays).
Romain | du latin Romanus : « de Rome ».
Romaric | du germanique hrod (gloire) et rik (puissant).
Roméo | de l’italien : « pèlerin de Rome ».
Romuald | du germanique hrod (gloire) et wald (gouverner).
Rosalie | du latin rosa : « rose ».
Roseline | du latin rosa : « rose ».
Rosine | du latin rosa : « rose ».
Rose de Lima | du latin rosa : « rose ».
Sabine | du latin Sabinus, du peuple sabin.
Samson | de l’hébreu shimshon : « soleil ».
Sandrine | forme d’Alexandra, du grec alexein et andros.
Saturnin | du latin Saturnus, le dieu du temps et des semailles.
Sébastien | du grec sebastos : « vénérable, auguste ».
Serge | du latin Sergius, nom de famille romaine.
Séverin | du latin severus : « sévère ».
Sidoine | du latin Sidonius : « de Sidon ».
Silvère | du latin silva : « forêt ».
Solange | du latin sollemnis : « solennel ».
Sophie | du grec sophia : « sagesse ».
Stanislas | du slave stan (devenir) et slava (gloire).
Sylvain | du latin silva : « forêt ».
Sylvie | du latin silva : « forêt ».
Tanguy | du breton tan (feu) et ki (chien) : « chien de feu ».
Tatiana | du latin Tatius, nom de famille romaine.
Théodore | du grec theos (Dieu) et doron (don) : « don de Dieu ».
Théophile | du grec theos (Dieu) et philos (ami) : « ami de Dieu ».
Thérèse | du grec thera : « chasse » — origine discutée.
Thibault | du germanique theud (peuple) et bald (audacieux).
Thierry | du germanique theud (peuple) et rik (puissant).
Thomas | de l’hébreu te’om : « jumeau ».
Ulrich | du germanique odal (patrimoine) et rik (puissant).
Urbain | du latin urbanus : « de la ville, courtois ».
Valentin | du latin valens : « vigoureux, en bonne santé ».
Valérie | du latin valere : « se bien porter, être fort ».
Venceslas | du slave vaclav : « plus de gloire ».
Véronique | du latin vera icon : « la vraie image » — le nom vient de la légende.
Victor | du latin victor : « vainqueur ».
Victorien | du latin victor : « vainqueur ».
Alida | diminutif d’Adélaïde, du germanique adal : « noble ».
Antoine | du latin antonius : « inestimable ».
Benoît | du latin benedictus : « béni ».
Boris | du slave, « combat » — sens discuté.
Ella | du germanique al : « tout » — sens discuté.
Florent | du latin florens : « florissant ».
Gildas | du celtique, « serviteur de Dieu » — sens discuté.
Gwladys | du gallois gwlad : « pays ».
Martinien | du latin Martinus, rattaché à Mars.
Mélaine | du grec melas : « noir ».
Nina | diminutif d’Anne et de Ninon.
Odilon | du germanique odal : « patrimoine, héritage ».
Sylvestre | du latin silvestris : « des bois ».
Thècle | du grec theos (Dieu) et kleos (gloire) : « gloire de Dieu ».
Brice | du latin Brictius, nom de l’évêque de Tours.
Aude | du germanique ald : « ancien » — forme méridionale.
Raïssa | du grec, « légère » — sens discuté.
Armel | du breton, nom du fondateur de Ploërmel.
Ghislain | du germanique gisil : « gage, otage de haut rang ».
Charles le Bon | du germanique karl : « homme libre, fort ».
Bérenger | du germanique berin (ours) et gari (lance).
Vincent | du latin vincens : « vainqueur ».
Viviane | du latin vivus : « vivante ».
Vivien | du latin vivus : « vivant ».
Wilfried | du germanique wil (volonté) et frid (paix).
Yves | du breton, « if » — l’arbre.
Yvette | forme picarde d’Yvonne, du breton « if ».
Zita | du toscan, diminutif devenu prénom.
Alban | du latin albus : « blanc ».
Anicet | du grec aniketos : « invincible ».
Aymar | du germanique haim (maison) et mar (illustre).
Charlotte | diminutif de Charles, du germanique karl : « homme libre, fort ».
Évrard | du germanique eber (sanglier) et hard (dur).
`;

/** Le sens d'un prénom : la phrase telle qu'elle s'écrit, ou `null`. */
export const PRENOMS: Record<string, string> = Object.fromEntries(
  TABLE.trim()
    .split('\n')
    .map((ligne) => {
      const [nom, sens] = ligne.split(' | ');
      return [nom!.trim(), sens!.trim()];
    }),
);

/** Combien de prénoms du calendrier sont documentés — le compte de la couche. */
export function significationDe(nom: string): string | null {
  const net = nom.replace(/^(Saint|Sainte|La |Le |Les )/, '').trim();
  if (PRENOMS[net]) return PRENOMS[net]!;
  /* Un nom composé se cherche aussi par son premier mot : « Thomas d'Aquin »
     est d'abord Thomas, « Jean-François Régis » est d'abord Jean. */
  const premier = net.split(/ d['’]| de | du | le | la | l['’]|\s/)[0]?.trim();
  if (premier && PRENOMS[premier]) return PRENOMS[premier]!;
  const joint = net.split(/[\s-]/)[0]?.trim();
  return joint ? (PRENOMS[joint] ?? null) : null;
}

export const PRENOMS_DOCUMENTES = Object.keys(PRENOMS).length;
