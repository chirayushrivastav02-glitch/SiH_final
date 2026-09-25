// src/pages/startup/MarketplacePage.jsx

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengesAPI } from '../../services/api';
import { sectors, mockMatchingData } from '../../data/mockData';
import { Search, ChevronRight, Send, ChevronDown } from 'lucide-react';

const statusColors = {
  Draft: 'badge-draft',
  Published: 'badge-published',
  Evaluation: 'badge-evaluation',
  Pilot: 'badge-pilot',
  Procurement: 'badge-procurement',
  Completed: 'badge-completed',
};

const matchFor = (id) =>
  mockMatchingData.find(m => m.challengeId === id)?.overallScore ?? null;

export default function MarketplacePage() {
  const navigate = useNavigate();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Controls which custom dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    let alive = true;

    challengesAPI
      .getAll({})
      .then(c => {
        if (alive) {
          setChallenges(c);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setFailed(true);
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filtered = challenges.filter(c => {
    const q = search.toLowerCase();

    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.problem.toLowerCase().includes(q);

    return (
      matchSearch &&
      (!sectorFilter || c.sector === sectorFilter) &&
      (!statusFilter || c.status === statusFilter)
    );
  });

  const sectorOptions = ['All Sectors', ...sectors];

  const statusOptions = [
    'All Statuses',
    'Published',
    'Evaluation',
    'Pilot',
    'Procurement',
    'Draft',
  ];

  const selectedSector =
    sectorFilter === '' ? 'All Sectors' : sectorFilter;

  const selectedStatus =
    statusFilter === '' ? 'All Statuses' : statusFilter;

  const handleSectorChange = value => {
    setSectorFilter(value === 'All Sectors' ? '' : value);
    setOpenDropdown(null);
  };

  const handleStatusChange = value => {
    setStatusFilter(value === 'All Statuses' ? '' : value);
    setOpenDropdown(null);
  };

  return (
    <div className="page-enter" data-testid="marketplace-page">
      <div className="section-header">
        <div>
          <h1
            className="section-title"
            data-testid="marketplace-title"
          >
            Challenge Marketplace
          </h1>

          <p className="section-subtitle">
            Browse government innovation challenges and submit your solution
          </p>
        </div>
      </div>

      <div
        className="filter-row"
        style={{ marginBottom: 20 }}
        ref={dropdownRef}
      >
        <div className="search-bar">
          <Search size={15} />

          <input
            placeholder="Search challenges, ministries, problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="marketplace-search-input"
          />
        </div>

        {/* ==================== SECTOR DROPDOWN ==================== */}

        <div className="custom-filter-dropdown">
          <button
            type="button"
            className={`custom-filter-trigger ${
              openDropdown === 'sector'
                ? 'custom-filter-trigger-open'
                : ''
            }`}
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'sector' ? null : 'sector'
              )
            }
            data-testid="marketplace-sector-filter"
          >
            <span>{selectedSector}</span>

            <ChevronDown
              size={16}
              className={`custom-filter-arrow ${
                openDropdown === 'sector'
                  ? 'custom-filter-arrow-open'
                  : ''
              }`}
            />
          </button>

          {openDropdown === 'sector' && (
            <div className="custom-filter-menu">
              {sectorOptions.map(option => {
                const isSelected = selectedSector === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`custom-filter-option ${
                      isSelected
                        ? 'custom-filter-option-selected'
                        : ''
                    }`}
                    onClick={() => handleSectorChange(option)}
                  >
                    <span>{option}</span>

                    {isSelected && (
                      <span className="custom-filter-check">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================== STATUS DROPDOWN ==================== */}

        <div className="custom-filter-dropdown">
          <button
            type="button"
            className={`custom-filter-trigger ${
              openDropdown === 'status'
                ? 'custom-filter-trigger-open'
                : ''
            }`}
            onClick={() =>
              setOpenDropdown(
                openDropdown === 'status' ? null : 'status'
              )
            }
            data-testid="marketplace-status-filter"
          >
            <span>{selectedStatus}</span>

            <ChevronDown
              size={16}
              className={`custom-filter-arrow ${
                openDropdown === 'status'
                  ? 'custom-filter-arrow-open'
                  : ''
              }`}
            />
          </button>

          {openDropdown === 'status' && (
            <div className="custom-filter-menu">
              {statusOptions.map(option => {
                const isSelected = selectedStatus === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`custom-filter-option ${
                      isSelected
                        ? 'custom-filter-option-selected'
                        : ''
                    }`}
                    onClick={() => handleStatusChange(option)}
                  >
                    <span>{option}</span>

                    {isSelected && (
                      <span className="custom-filter-check">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
          data-testid="marketplace-loading"
        >
          Loading challenges…
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: 16,
        }}
        data-testid="marketplace-challenge-grid"
      >
        {filtered.map(c => {
          const score = matchFor(c.id);

          return (
            <div
              key={c.id}
              className="challenge-card"
              onClick={() =>
                navigate(`/startup/marketplace/${c.id}`)
              }
              data-testid={`marketplace-challenge-card-${c.id}`}
            >
              <div className="challenge-card-header">
                <div>
                  <code
                    style={{
                      fontSize: 11,
                      color: 'var(--teal-400)',
                    }}
                  >
                    {c.id}
                  </code>

                  <div
                    className="challenge-card-title"
                    style={{ marginTop: 4 }}
                  >
                    {c.title}
                  </div>
                </div>

                <span
                  className={`badge ${
                    statusColors[c.status] || ''
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {c.problem.slice(0, 110)}…
              </div>

              <div className="challenge-card-meta">
                <span className="challenge-meta-item">
                  🏛️ {c.department}
                </span>

                <span className="challenge-meta-item">
                  💰 {c.budget}
                </span>

                <span className="challenge-meta-item">
                  📅 {c.deadline || 'TBD'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span className="tag teal">
                  {c.sector}
                </span>

                {c.tags.slice(0, 2).map(t => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop:
                    '1px solid var(--border-color)',
                }}
              >
                {score !== null ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <div
                      className={`match-score ${
                        score >= 90 ? 'high' : 'medium'
                      }`}
                    >
                      {score}%
                    </div>

                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                      }}
                    >
                      AI match
                    </span>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {c.applications} applications
                  </span>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/startup/marketplace/${c.id}`
                      );
                    }}
                    data-testid={`marketplace-view-button-${c.id}`}
                  >
                    View <ChevronRight size={13} />
                  </button>

                  <button
                    className="btn btn-sm btn-primary"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/startup/marketplace/${c.id}/apply`
                      );
                    }}
                    data-testid={`marketplace-apply-button-${c.id}`}
                  >
                    <Send size={13} /> Apply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div
          className="empty-state"
          data-testid="marketplace-empty-state"
        >
          <div className="empty-state-icon">🎯</div>

          <div className="empty-state-title">
            {failed
              ? 'Challenge feed unavailable'
              : 'No challenges match your filters'}
          </div>

          <p style={{ marginBottom: 16 }}>
            {failed
              ? 'Reconnect to load live challenges.'
              : 'Try widening your search.'}
          </p>

          {!failed && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setSearch('');
                setSectorFilter('');
                setStatusFilter('');
                setOpenDropdown(null);
              }}
              data-testid="marketplace-clear-filters-button"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}