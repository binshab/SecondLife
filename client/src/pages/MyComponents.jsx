import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Cpu, 
  Tag, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import AddComponentModal from '../components/AddComponentModal';

export default function MyComponents({ 
  inventory = [], 
  onAdd, 
  onUpdate, 
  onDelete, 
  onResetDemo,
  onNavigate 
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleSave = (itemData) => {
    if (editingItem) {
      onUpdate(editingItem.id, itemData);
    } else {
      onAdd(itemData);
    }
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <Cpu size={32} color="var(--primary)" />
              My Component Inventory
            </h1>
            <p className="page-subtitle">
              Manage the electronic hardware, sensors, and microcontrollers currently in your possession. SecondLife uses this inventory to compute project feasibility.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={18} />
              <span>+ Add Component</span>
            </button>
          </div>
        </div>
      </section>

      {/* Demo Preset Bar */}
      <div style={{ 
        backgroundColor: 'var(--primary-light)', 
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.9rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={20} color="var(--primary)" />
          <span style={{ fontSize: '0.88rem', color: '#065f46', fontWeight: '600' }}>
            Demo Quick-Setup: Test with standard 4-component hackathon payload (ESP32, Ultrasonic Sensor, LED, Buzzer).
          </span>
        </div>

        <button 
          className="demo-preset-pill" 
          onClick={onResetDemo}
          style={{ backgroundColor: '#ffffff' }}
        >
          <RotateCcw size={13} />
          Reload Default Demo Inventory
        </button>
      </div>

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Cpu size={32} />
          </div>
          <h3>Your inventory is empty</h3>
          <p>
            Add the electronic modules you have lying in your drawer, or reload the demo preset to discover matching projects.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={16} /> Add First Component
            </button>
            <button className="btn-secondary" onClick={onResetDemo}>
              <RotateCcw size={16} /> Load Demo Items
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            fontSize: '0.88rem',
            color: 'var(--text-muted)'
          }}>
            <span>Showing <strong>{inventory.length}</strong> components available for reuse</span>
            <button 
              className="btn-primary btn-sm"
              onClick={() => onNavigate('what-can-i-build')}
            >
              <Sparkles size={14} /> Run "What Can I Build?"
            </button>
          </div>

          <div className="inventory-grid">
            {inventory.map((item) => (
              <div key={item.id} className="inventory-card">
                <div>
                  <div className="inventory-card-top">
                    <div>
                      <h3 className="inventory-comp-name">{item.name}</h3>
                      <div className="inventory-meta-row" style={{ marginTop: '0.4rem' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                          {item.category}
                        </span>
                        <span className="badge badge-gray" style={{ fontSize: '0.74rem' }}>
                          {item.condition}
                        </span>
                      </div>
                    </div>

                    <div className="inventory-qty-badge">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  {item.description ? (
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0.5rem 0' }}>
                      {item.description}
                    </p>
                  ) : (
                    <div style={{ height: '0.5rem' }} />
                  )}

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
                    Approx. Weight: ~{item.weightPerUnit || 10}g per unit
                  </div>
                </div>

                <div className="inventory-actions-row">
                  <button 
                    className="btn-secondary btn-sm"
                    onClick={() => handleEdit(item)}
                    title="Edit component"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>

                  <button 
                    className="btn-danger-outline"
                    onClick={() => onDelete(item.id)}
                    title="Remove from inventory"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <AddComponentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}
