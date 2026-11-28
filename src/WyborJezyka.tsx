// Przełącznik PL/EN/DE na stronie głównej i w panelu „i”.
import { JEZYKI, jezyk, t, zmienJezyk } from './teksty.ts';

export function WyborJezyka() {
  return (
    <div className="wybor-jezyka" role="group" aria-label={t.wyborJezyka}>
      {JEZYKI.map((j) => (
        <button key={j} lang={j} aria-pressed={j === jezyk} onClick={() => zmienJezyk(j)}>
          {j.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
