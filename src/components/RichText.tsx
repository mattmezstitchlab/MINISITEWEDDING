/**
 * LE TEXTE ÉDITORIAL
 *
 * Le gras se marque avec des doubles astérisques — « **12 400 €** » — comme dans
 * une rédaction. C'est ce qui fait ressortir les informations qui comptent :
 * chiffres, horaires, montants, noms de métiers.
 */
export default function RichText({ text, className = '' }: { text: string; className?: string }) {
  const paragraphes = text.split('\n\n');

  return (
    <>
      {paragraphes.map((bloc, index) => (
        <p key={`${index}-${bloc.slice(0, 12)}`} className={index === 0 ? className : `${className} mt-3`}>
          {bloc.split('**').map((morceau, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="font-bold text-[#0B0C12]">
                {morceau}
              </strong>
            ) : (
              <span key={i}>{morceau}</span>
            ),
          )}
        </p>
      ))}
    </>
  );
}
