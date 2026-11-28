import { describe, expect, it, vi } from 'vitest';
import { udostepnijPunkt } from './udostepnianie.ts';

const ADRES = 'ul. Mszczonowska 3, Janki';
const LINK = 'https://www.google.com/maps/dir/?api=1&destination=52.1,20.9';

const blad = (name: string) => Object.assign(new Error(name), { name });

describe('udostępnianie punktu', () => {
  it('z Web Share wysyła adres i link przez systemowe okno', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn();
    expect(await udostepnijPunkt(ADRES, LINK, { share, clipboard: { writeText } })).toBe('udostepniono');
    expect(share).toHaveBeenCalledWith({ title: ADRES, text: ADRES, url: LINK });
    expect(writeText).not.toHaveBeenCalled();
  });

  it('bez Web Share kopiuje adres i link do schowka', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await udostepnijPunkt(ADRES, LINK, { clipboard: { writeText } })).toBe('skopiowano');
    expect(writeText).toHaveBeenCalledWith(`${ADRES}\n${LINK}`);
  });

  it('zamknięcie okna udostępniania nie kopiuje do schowka', async () => {
    const share = vi.fn().mockRejectedValue(blad('AbortError'));
    const writeText = vi.fn();
    expect(await udostepnijPunkt(ADRES, LINK, { share, clipboard: { writeText } })).toBe('anulowano');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('gdy Web Share zawiedzie z innego powodu, używa schowka', async () => {
    const share = vi.fn().mockRejectedValue(blad('NotAllowedError'));
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await udostepnijPunkt(ADRES, LINK, { share, clipboard: { writeText } })).toBe('skopiowano');
  });

  it('bez Web Share i schowka zgłasza błąd', async () => {
    expect(await udostepnijPunkt(ADRES, LINK, {})).toBe('blad');
    const writeText = vi.fn().mockRejectedValue(blad('NotAllowedError'));
    expect(await udostepnijPunkt(ADRES, LINK, { clipboard: { writeText } })).toBe('blad');
  });
});
