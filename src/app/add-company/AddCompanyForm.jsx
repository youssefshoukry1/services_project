"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mockData } from "../../../mockData";
import styles from "./add-company.module.css";

const storageKey = "servicehub-company-draft-v1";
const initialForm = {
  id: "",
  categoryId: "",
  name: "",
  logo: "",
  shortDesc: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  prices: [{ service: "", price: "" }],
};
const steps = ["Unternehmen", "Kontakt", "Leistungen", "Prüfen"];

function validate(form, step) {
  const errors = {};
  if (step === 0) {
    if (!form.categoryId) errors.categoryId = "Wählen Sie eine Dienstleistungskategorie.";
    if (form.name.trim().length < 2) errors.name = "Geben Sie einen Firmennamen mit mindestens 2 Zeichen ein.";
    if (form.shortDesc.trim().length < 20) errors.shortDesc = "Beschreiben Sie Ihr Unternehmen mit mindestens 20 Zeichen.";
  }
  if (step === 1) {
    if (form.address.trim().length < 5) errors.address = "Geben Sie Ihre Geschäftsadresse oder Ihr Einsatzgebiet ein.";
    if (!/^\+?[\d\s().-]{7,}$/.test(form.phone.trim())) errors.phone = "Geben Sie eine gültige Telefonnummer ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Geben Sie eine gültige E-Mail-Adresse ein.";
    if (form.website.trim()) {
      try {
        const url = new URL(form.website.trim());
        if (!["http:", "https:"].includes(url.protocol)) errors.website = "Verwenden Sie eine Webadresse mit http oder https.";
      } catch { errors.website = "Geben Sie eine vollständige Webadresse ein, zum Beispiel https://example.com."; }
    }
  }
  if (step === 2) {
    form.prices.forEach((item, index) => {
      if (!item.service.trim()) errors[`service-${index}`] = "Geben Sie die Leistung ein.";
      if (!item.price.trim()) errors[`price-${index}`] = "Geben Sie einen Preis oder Einstiegspreis ein.";
    });
  }
  return errors;
}

function Field({ id, label, hint, error, children }) {
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{hint && <small>{hint}</small>}{children}{error && <span className={styles.error} role="alert">{error}</span>}</div>;
}

export default function AddCompanyForm() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState("");
  const [logoName, setLogoName] = useState("");
  const [notice, setNotice] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (draft && typeof draft === "object" && Array.isArray(draft.prices)) {
        setForm({ ...initialForm, ...draft });
        setNotice("Ihr gespeicherter Entwurf wurde wiederhergestellt. Wählen Sie das Logo erneut aus.");
      }
    } catch { /* Ignore a damaged local draft. */ }
  }, []);

  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview); }, [logoPreview]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setNotice("");
    setSaved(false);
  }

  function updatePrice(index, name, value) {
    setForm((current) => ({ ...current, prices: current.prices.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: value } : item) }));
    setErrors((current) => ({ ...current, [`${name}-${index}`]: undefined }));
    setSaved(false);
  }

  function saveDraft() {
    try {
      const draft = { ...form, id: form.id || `draft-${crypto.randomUUID()}` };
      localStorage.setItem(storageKey, JSON.stringify(draft));
      setForm(draft);
      setNotice("Der Entwurf wurde in diesem Browser gespeichert. Er wurde nicht veröffentlicht oder an ServiceHub gesendet.");
      setSaved(true);
    } catch {
      setNotice("Der Entwurf konnte nicht gespeichert werden. Prüfen Sie die Speichereinstellungen Ihres Browsers.");
      setSaved(false);
    }
  }

  function next() {
    const nextErrors = validate(form, step);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      document.getElementById("form-error-summary")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setNotice("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/webp", "image/png", "image/jpeg"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, logo: "Wählen Sie ein WebP-, PNG- oder JPEG-Bild unter 2 MB." }));
      event.target.value = "";
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
    setLogoName(file.name);
    setForm((current) => ({ ...current, logo: file.name }));
    setErrors((current) => ({ ...current, logo: undefined }));
  }

  const category = mockData.categories.find((item) => item.id === form.categoryId);
  const initials = form.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "SH";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <Link href="/services" className={styles.backLink}>← Dienstleistungen entdecken</Link>
          <span className={styles.eyebrow}>Kostenloser Unternehmenseintrag</span>
          <h1>Zeigen Sie, was Sie anbieten.</h1>
          <p>Erstellen Sie ein Profil, damit Kunden in Ihrer Nähe Ihr Unternehmen finden und kontaktieren können.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <div className={styles.progressLabel}><span>Schritt {step + 1} von {steps.length}</span><strong>{steps[step]}</strong></div>
            <div className={styles.progressTrack}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <ol className={styles.steps} aria-label="Formularschritte">{steps.map((item, index) => <li key={item} className={index === step ? styles.currentStep : index < step ? styles.doneStep : ""} aria-current={index === step ? "step" : undefined}><span>{index + 1}</span>{item}</li>)}</ol>

            {Object.values(errors).some(Boolean) && <div id="form-error-summary" className={styles.errorSummary} role="alert">Bitte korrigieren Sie die markierten Felder.</div>}
            {notice && <p className={styles.notice} role="status">{notice}</p>}

            {step === 0 && <section className={styles.formSection} aria-labelledby="company-heading">
              <h2 id="company-heading">Angaben zum Unternehmen</h2><p>Beginnen Sie mit den wichtigsten Angaben für Ihre Kunden.</p>
              <Field id="category" label="Dienstleistungskategorie" error={errors.categoryId}><select id="category" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} aria-invalid={Boolean(errors.categoryId)}><option value="">Kategorie wählen</option>{mockData.categories.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
              <Field id="name" label="Firmenname" error={errors.name}><input id="name" type="text" autoComplete="organization" maxLength="80" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="z. B. ColorPro Painters" aria-invalid={Boolean(errors.name)} /></Field>
              <Field id="shortDesc" label="Kurzbeschreibung" hint="20–220 Zeichen. Beschreiben Sie Ihr Angebot." error={errors.shortDesc}><textarea id="shortDesc" rows="4" maxLength="220" value={form.shortDesc} onChange={(event) => update("shortDesc", event.target.value)} placeholder="Beschreiben Sie Ihre Leistungen ..." aria-invalid={Boolean(errors.shortDesc)} /><span className={styles.counter}>{form.shortDesc.length}/220</span></Field>
              <Field id="logo" label="Firmenlogo" hint="WebP, PNG, or JPEG. Bis 2 MB. Die Vorschau bleibt in dieser Sitzung." error={errors.logo}><div className={styles.logoUpload}><div className={styles.preview}>{logoPreview ? <img src={logoPreview} alt="Vorschau des Firmenlogos" /> : initials}</div><div><input id="logo" type="file" accept="image/webp,image/png,image/jpeg" onChange={chooseLogo} /><span>{logoName || "Bild für Ihren Eintrag auswählen"}</span></div></div></Field>
            </section>}

            {step === 1 && <section className={styles.formSection} aria-labelledby="contact-heading">
              <h2 id="contact-heading">Kontaktdaten</h2><p>Zeigen Sie Kunden, wie sie Sie erreichen können.</p>
              <Field id="address" label="Geschäftsadresse oder Einsatzgebiet" error={errors.address}><input id="address" type="text" autoComplete="street-address" value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="z. B. Musterstraße 12, 10115 Berlin" aria-invalid={Boolean(errors.address)} /></Field>
              <div className={styles.twoColumns}><Field id="phone" label="Telefonnummer" error={errors.phone}><input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+49 30 0000 0001" aria-invalid={Boolean(errors.phone)} /></Field><Field id="email" label="Geschäftliche E-Mail-Adresse" error={errors.email}><input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="hello@company.com" aria-invalid={Boolean(errors.email)} /></Field></div>
              <Field id="website" label="Webseite (optional)" hint="Geben Sie https:// an, wenn Sie eine Webseite haben." error={errors.website}><input id="website" type="url" autoComplete="url" value={form.website} onChange={(event) => update("website", event.target.value)} placeholder="https://example.com" aria-invalid={Boolean(errors.website)} /></Field>
            </section>}

            {step === 2 && <section className={styles.formSection} aria-labelledby="services-heading">
              <h2 id="services-heading">Leistungen &amp; Preise</h2><p>Fügen Sie mindestens eine Leistung hinzu. Sie können einen Einstiegspreis oder Stundensatz angeben.</p>
              {form.prices.map((item, index) => <div className={styles.priceRow} key={index}><div className={styles.priceHeading}><strong>Leistung {index + 1}</strong>{form.prices.length > 1 && <button type="button" onClick={() => update("prices", form.prices.filter((_, itemIndex) => itemIndex !== index))}>Entfernen</button>}</div><div className={styles.twoColumns}><Field id={`service-${index}`} label="Leistungsname" error={errors[`service-${index}`]}><input id={`service-${index}`} type="text" value={item.service} onChange={(event) => updatePrice(index, "service", event.target.value)} placeholder="z. B. Innenwände streichen" aria-invalid={Boolean(errors[`service-${index}`])} /></Field><Field id={`price-${index}`} label="Preis oder Satz" error={errors[`price-${index}`]}><input id={`price-${index}`} type="text" value={item.price} onChange={(event) => updatePrice(index, "price", event.target.value)} placeholder="z. B. 10 € / m²" aria-invalid={Boolean(errors[`price-${index}`])} /></Field></div></div>)}
              <button type="button" className={styles.addService} onClick={() => update("prices", [...form.prices, { service: "", price: "" }])}>+ Weitere Leistung hinzufügen</button>
            </section>}

            {step === 3 && <section className={styles.formSection} aria-labelledby="review-heading">
              <h2 id="review-heading">Eintrag prüfen</h2><p>Prüfen Sie Ihre Angaben, bevor Sie den Entwurf speichern.</p>
              <div className={styles.reviewCard}><div className={styles.reviewHeader}><div className={styles.preview}>{logoPreview ? <img src={logoPreview} alt="" /> : initials}</div><div><span>{category?.title}</span><h3>{form.name}</h3></div></div><p>{form.shortDesc}</p><dl><div><dt>Adresse</dt><dd>{form.address}</dd></div><div><dt>Telefon</dt><dd>{form.phone}</dd></div><div><dt>E-Mail</dt><dd>{form.email}</dd></div>{form.website && <div><dt>Webseite</dt><dd>{form.website}</dd></div>}</dl><h4>Leistungen &amp; Preise</h4><ul>{form.prices.map((item, index) => <li key={index}><span>{item.service}</span><strong>{item.price}</strong></li>)}</ul></div>
              <div className={styles.draftWarning}><strong>Ihr Unternehmen wird noch nicht veröffentlicht.</strong><p>Der Entwurf wird nur in diesem Browser gespeichert. Eine Einreichung ist derzeit noch nicht möglich.</p></div>
            </section>}

            <div className={styles.actions}>
              {step > 0 && <button type="button" className={styles.secondaryButton} onClick={() => { setErrors({}); setStep((current) => current - 1); }}>Zurück</button>}
              <button type="button" className={styles.saveButton} onClick={saveDraft}>{saved ? "Entwurf gespeichert" : "Entwurf speichern"}</button>
              {step < steps.length - 1 && <button type="button" className={styles.primaryButton} onClick={next}>Weiter <span aria-hidden="true">→</span></button>}
            </div>
          </div>

          <aside className={styles.helpPanel}><span>Warum bei ServiceHub eintragen?</span><h2>Machen Sie Ihr Unternehmen auffindbar.</h2><ul><li>Zeigen Sie Kunden Ihr Angebot.</li><li>Zeigen Sie Preise und Kontaktdaten.</li><li>Hinterlassen Sie einen professionellen ersten Eindruck.</li></ul><p>Der Eintrag ist kostenlos. Entwürfe bleiben auf diesem Gerät, bis eine Veröffentlichung möglich ist.</p></aside>
        </div>
      </div>
    </main>
  );
}
