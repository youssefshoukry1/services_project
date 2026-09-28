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
const steps = ["Company", "Contact", "Services", "Review"];

function validate(form, step) {
  const errors = {};
  if (step === 0) {
    if (!form.categoryId) errors.categoryId = "Choose a service category.";
    if (form.name.trim().length < 2) errors.name = "Enter a company name of at least 2 characters.";
    if (form.shortDesc.trim().length < 20) errors.shortDesc = "Add a short description of at least 20 characters.";
  }
  if (step === 1) {
    if (form.address.trim().length < 5) errors.address = "Enter your business address or service area.";
    if (!/^\+?[\d\s().-]{7,}$/.test(form.phone.trim())) errors.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (form.website.trim()) {
      try {
        const url = new URL(form.website.trim());
        if (!["http:", "https:"].includes(url.protocol)) errors.website = "Use an http or https website URL.";
      } catch { errors.website = "Enter a full website URL, such as https://example.com."; }
    }
  }
  if (step === 2) {
    form.prices.forEach((item, index) => {
      if (!item.service.trim()) errors[`service-${index}`] = "Enter the service name.";
      if (!item.price.trim()) errors[`price-${index}`] = "Enter a price or starting price.";
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
        setNotice("Your saved draft was restored. Choose the logo again before publishing later.");
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
      setNotice("Draft saved in this browser. It is not published or sent to ServiceHub.");
      setSaved(true);
    } catch {
      setNotice("This browser could not save the draft. Please check storage permissions.");
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
      setErrors((current) => ({ ...current, logo: "Choose a WebP, PNG, or JPEG image under 2 MB." }));
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
          <Link href="/services" className={styles.backLink}>← Browse services</Link>
          <span className={styles.eyebrow}>Free company listing</span>
          <h1>Tell people what you do.</h1>
          <p>Create a clear profile so local customers can find and contact your business.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.formPanel}>
            <div className={styles.progressLabel}><span>Step {step + 1} of {steps.length}</span><strong>{steps[step]}</strong></div>
            <div className={styles.progressTrack}><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
            <ol className={styles.steps} aria-label="Form steps">{steps.map((item, index) => <li key={item} className={index === step ? styles.currentStep : index < step ? styles.doneStep : ""} aria-current={index === step ? "step" : undefined}><span>{index + 1}</span>{item}</li>)}</ol>

            {Object.values(errors).some(Boolean) && <div id="form-error-summary" className={styles.errorSummary} role="alert">Please fix the highlighted fields before continuing.</div>}
            {notice && <p className={styles.notice} role="status">{notice}</p>}

            {step === 0 && <section className={styles.formSection} aria-labelledby="company-heading">
              <h2 id="company-heading">Company details</h2><p>Start with the essentials customers will see first.</p>
              <Field id="category" label="Service category" error={errors.categoryId}><select id="category" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} aria-invalid={Boolean(errors.categoryId)}><option value="">Choose a category</option>{mockData.categories.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
              <Field id="name" label="Company name" error={errors.name}><input id="name" type="text" autoComplete="organization" maxLength="80" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. ColorPro Painters" aria-invalid={Boolean(errors.name)} /></Field>
              <Field id="shortDesc" label="Short description" hint="20–220 characters. Say what makes your work useful." error={errors.shortDesc}><textarea id="shortDesc" rows="4" maxLength="220" value={form.shortDesc} onChange={(event) => update("shortDesc", event.target.value)} placeholder="Describe the services you provide..." aria-invalid={Boolean(errors.shortDesc)} /><span className={styles.counter}>{form.shortDesc.length}/220</span></Field>
              <Field id="logo" label="Company logo" hint="WebP, PNG, or JPEG. Up to 2 MB. Your logo preview stays in this session." error={errors.logo}><div className={styles.logoUpload}><div className={styles.preview}>{logoPreview ? <img src={logoPreview} alt="Selected company logo preview" /> : initials}</div><div><input id="logo" type="file" accept="image/webp,image/png,image/jpeg" onChange={chooseLogo} /><span>{logoName || "Choose an image for your listing"}</span></div></div></Field>
            </section>}

            {step === 1 && <section className={styles.formSection} aria-labelledby="contact-heading">
              <h2 id="contact-heading">Contact information</h2><p>Let customers know where and how to reach you.</p>
              <Field id="address" label="Business address or service area" error={errors.address}><input id="address" type="text" autoComplete="street-address" value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="e.g. 123 Main St, Giza" aria-invalid={Boolean(errors.address)} /></Field>
              <div className={styles.twoColumns}><Field id="phone" label="Phone number" error={errors.phone}><input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+20 101 111 1111" aria-invalid={Boolean(errors.phone)} /></Field><Field id="email" label="Business email" error={errors.email}><input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="hello@company.com" aria-invalid={Boolean(errors.email)} /></Field></div>
              <Field id="website" label="Website (optional)" hint="Include https:// if you have a website." error={errors.website}><input id="website" type="url" autoComplete="url" value={form.website} onChange={(event) => update("website", event.target.value)} placeholder="https://example.com" aria-invalid={Boolean(errors.website)} /></Field>
            </section>}

            {step === 2 && <section className={styles.formSection} aria-labelledby="services-heading">
              <h2 id="services-heading">Services &amp; pricing</h2><p>Add at least one service. You can use a starting price or a rate.</p>
              {form.prices.map((item, index) => <div className={styles.priceRow} key={index}><div className={styles.priceHeading}><strong>Service {index + 1}</strong>{form.prices.length > 1 && <button type="button" onClick={() => update("prices", form.prices.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>}</div><div className={styles.twoColumns}><Field id={`service-${index}`} label="Service name" error={errors[`service-${index}`]}><input id={`service-${index}`} type="text" value={item.service} onChange={(event) => updatePrice(index, "service", event.target.value)} placeholder="e.g. Interior painting" aria-invalid={Boolean(errors[`service-${index}`])} /></Field><Field id={`price-${index}`} label="Price or rate" error={errors[`price-${index}`]}><input id={`price-${index}`} type="text" value={item.price} onChange={(event) => updatePrice(index, "price", event.target.value)} placeholder="e.g. $10 / sqm" aria-invalid={Boolean(errors[`price-${index}`])} /></Field></div></div>)}
              <button type="button" className={styles.addService} onClick={() => update("prices", [...form.prices, { service: "", price: "" }])}>+ Add another service</button>
            </section>}

            {step === 3 && <section className={styles.formSection} aria-labelledby="review-heading">
              <h2 id="review-heading">Review your listing</h2><p>Check the details before saving this local draft.</p>
              <div className={styles.reviewCard}><div className={styles.reviewHeader}><div className={styles.preview}>{logoPreview ? <img src={logoPreview} alt="" /> : initials}</div><div><span>{category?.title}</span><h3>{form.name}</h3></div></div><p>{form.shortDesc}</p><dl><div><dt>Address</dt><dd>{form.address}</dd></div><div><dt>Phone</dt><dd>{form.phone}</dd></div><div><dt>Email</dt><dd>{form.email}</dd></div>{form.website && <div><dt>Website</dt><dd>{form.website}</dd></div>}</dl><h4>Services &amp; pricing</h4><ul>{form.prices.map((item, index) => <li key={index}><span>{item.service}</span><strong>{item.price}</strong></li>)}</ul></div>
              <div className={styles.draftWarning}><strong>This does not publish your company yet.</strong><p>The draft is saved only in this browser. Listing submission will be connected when the backend is ready.</p></div>
            </section>}

            <div className={styles.actions}>
              {step > 0 && <button type="button" className={styles.secondaryButton} onClick={() => { setErrors({}); setStep((current) => current - 1); }}>Back</button>}
              <button type="button" className={styles.saveButton} onClick={saveDraft}>{saved ? "Draft saved" : "Save draft"}</button>
              {step < steps.length - 1 && <button type="button" className={styles.primaryButton} onClick={next}>Continue <span aria-hidden="true">→</span></button>}
            </div>
          </div>

          <aside className={styles.helpPanel}><span>Why list on ServiceHub?</span><h2>Make it easy to find you.</h2><ul><li>Show customers what you offer.</li><li>Share clear prices and contact details.</li><li>Create a professional first impression.</li></ul><p>Listing is free. Drafts are stored on this device until publishing is available.</p></aside>
        </div>
      </div>
    </main>
  );
}
