import React, { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { NEXERA } from '../config/nexera';

const ContactForm = ({ onClose }) => {
  const snap = useSnapshot(state);
  const [sent, setSent] = useState(false);

  const update = (key, value) => {
    state.contact[key] = value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="contact-panel">
        <button type="button" className="contact-close" onClick={onClose} aria-label="Fermer">×</button>
        <p className="text-sm font-semibold">Merci !</p>
        <p className="text-xs opacity-70 mt-2">
          {NEXERA.name} vous recontactera sous 24–48 h pour discuter de votre projet.
        </p>
      </div>
    );
  }

  return (
    <div className="contact-panel">
      <button type="button" className="contact-close" onClick={onClose} aria-label="Fermer">×</button>
      <h3 className="contact-title">Nous contacter</h3>
      <p className="text-[10px] text-gray-500 mb-2">
        Pack : <strong>{snap.selectedPack ?? 'starter'}</strong> · Univers : <strong>{snap.selectedUniverse ?? 'parfumerie'}</strong>
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          required
          placeholder="Nom & prénom"
          value={snap.contact.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <input
          placeholder="Société / Marque"
          value={snap.contact.company}
          onChange={(e) => update('company', e.target.value)}
        />
        <input
          required
          type="email"
          placeholder="E-mail"
          value={snap.contact.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <input
          placeholder="Téléphone"
          value={snap.contact.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
        <input
          type="number"
          min="1"
          placeholder="Nombre de flacons"
          value={snap.contact.qtyBottles}
          onChange={(e) => update('qtyBottles', e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Nombre de pompes"
          value={snap.contact.qtyPumps}
          onChange={(e) => update('qtyPumps', e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Nombre de bouchons"
          value={snap.contact.qtyCaps}
          onChange={(e) => update('qtyCaps', e.target.value)}
        />
        <textarea
          rows={3}
          placeholder="Décrivez votre projet cosmétique…"
          value={snap.contact.message}
          onChange={(e) => update('message', e.target.value)}
        />
        <button type="submit" className="summary-btn primary w-full">Envoyer</button>
      </form>
      <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">{NEXERA.address}</p>
    </div>
  );
};

export default ContactForm;
