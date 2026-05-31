import React from 'react';

const ResetModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>Réinitialiser le design ?</h3>
        <p>
          Toutes vos modifications seront effacées et le design reviendra à l&apos;état par défaut.
          Continuer ?
        </p>
        <div className="modal-actions">
          <button type="button" className="summary-btn" onClick={onCancel}>Non</button>
          <button type="button" className="summary-btn primary" onClick={onConfirm}>Oui</button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
