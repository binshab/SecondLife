import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { COMPONENT_CATEGORIES } from '../utils/seedData';

export default function AddComponentModal({ isOpen, onClose, onSave, initialData = null }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Microcontroller');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Working');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'Microcontroller');
      setQuantity(initialData.quantity || 1);
      setCondition(initialData.condition || 'Working');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCategory('Microcontroller');
      setQuantity(1);
      setCondition('Working');
      setDescription('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Component name is required');
      return;
    }
    onSave({
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      condition,
      description: description.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.4rem' }}>
            {initialData ? 'Edit Component' : 'Add Component to Inventory'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              padding: '0.65rem 0.9rem', 
              backgroundColor: 'var(--accent-rose-light)', 
              color: 'var(--accent-rose)', 
              borderRadius: 'var(--radius-md)', 
              fontSize: '0.85rem',
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Component Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ESP32, Ultrasonic Sensor, SG90 Servo"
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {COMPONENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                max="999"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Condition</label>
            <select
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="Working">Working (Fully Functional)</option>
              <option value="Untested">Untested (Kept safely)</option>
              <option value="Minor Defect">Minor Defect (For parts/experiment)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Used in final year IoT mini project. Pins intact."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? <Save size={16} /> : <Plus size={16} />}
              <span>{initialData ? 'Update Component' : 'Add Component'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
