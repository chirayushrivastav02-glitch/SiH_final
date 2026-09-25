import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mockChallenges,
  sectors,
  departments,
} from '../../data/mockData';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Globe,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react';

const statusColors = {
  Draft: 'badge-draft',
  Published: 'badge-published',
  Evaluation: 'badge-evaluation',
  Pilot: 'badge-pilot',
  Procurement: 'badge-procurement',
  Completed: 'badge-completed',
};

export default function ChallengesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] =
    useState('');
  const [statusFilter, setStatusFilter] =
    useState('');
  const [view, setView] = useState('table');

  const [openDropdown, setOpenDropdown] =
    useState(null);

  const filtered = mockChallenges.filter(c => {
    const matchSearch =
      !search ||
      c.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.department
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchSector =
      !sectorFilter ||
      c.sector === sectorFilter;

    const matchStatus =
      !statusFilter ||
      c.status === statusFilter;

    return (
      matchSearch &&
      matchSector &&
      matchStatus
    );
  });

  const toggleDropdown = name => {
    setOpenDropdown(
      openDropdown === name ? null : name
    );
  };

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            Challenges
          </h1>

          <p className="section-subtitle">
            Manage government innovation challenges across
            all departments
          </p>
        </div>

        <div className="section-actions">
          <button
            className="btn btn-secondary"
            onClick={() =>
              setView(v =>
                v === 'table'
                  ? 'cards'
                  : 'table'
              )
            }
          >
            {view === 'table'
              ? '⊞ Cards'
              : '☰ Table'}
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                '/gov/challenges/create'
              )
            }
          >
            <Plus size={16} />
            Create Challenge
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="filter-row"
        style={{ marginBottom: 20 }}
      >
        <div className="search-bar">
          <Search size={15} />

          <input
            placeholder="Search challenges..."
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* Sector */}
        <div className="custom-filter-dropdown">
          <button
            type="button"
            className={`custom-filter-trigger ${
              openDropdown === 'sector'
                ? 'custom-filter-trigger-open'
                : ''
            }`}
            onClick={() =>
              toggleDropdown('sector')
            }
          >
            <span>
              {sectorFilter || 'All Sectors'}
            </span>

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
              <button
                type="button"
                className={`custom-filter-option ${
                  sectorFilter === ''
                    ? 'custom-filter-option-selected'
                    : ''
                }`}
                onClick={() => {
                  setSectorFilter('');
                  setOpenDropdown(null);
                }}
              >
                <span>All Sectors</span>

                {sectorFilter === '' && (
                  <Check
                    size={14}
                    className="custom-filter-check"
                  />
                )}
              </button>

              {sectors.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`custom-filter-option ${
                    sectorFilter === s
                      ? 'custom-filter-option-selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSectorFilter(s);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{s}</span>

                  {sectorFilter === s && (
                    <Check
                      size={14}
                      className="custom-filter-check"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="custom-filter-dropdown">
          <button
            type="button"
            className={`custom-filter-trigger ${
              openDropdown === 'status'
                ? 'custom-filter-trigger-open'
                : ''
            }`}
            onClick={() =>
              toggleDropdown('status')
            }
          >
            <span>
              {statusFilter || 'All Statuses'}
            </span>

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
              <button
                type="button"
                className={`custom-filter-option ${
                  statusFilter === ''
                    ? 'custom-filter-option-selected'
                    : ''
                }`}
                onClick={() => {
                  setStatusFilter('');
                  setOpenDropdown(null);
                }}
              >
                <span>All Statuses</span>

                {statusFilter === '' && (
                  <Check
                    size={14}
                    className="custom-filter-check"
                  />
                )}
              </button>

              {[
                'Draft',
                'Published',
                'Evaluation',
                'Pilot',
                'Procurement',
                'Completed',
              ].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`custom-filter-option ${
                    statusFilter === s
                      ? 'custom-filter-option-selected'
                      : ''
                  }`}
                  onClick={() => {
                    setStatusFilter(s);
                    setOpenDropdown(null);
                  }}
                >
                  <span>{s}</span>

                  {statusFilter === s && (
                    <Check
                      size={14}
                      className="custom-filter-check"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            label: 'Total',
            value: mockChallenges.length,
            color: 'var(--text-primary)',
          },
          {
            label: 'Published',
            value: mockChallenges.filter(
              c => c.status === 'Published'
            ).length,
            color: 'var(--green-400)',
          },
          {
            label: 'Evaluation',
            value: mockChallenges.filter(
              c => c.status === 'Evaluation'
            ).length,
            color: 'var(--amber-300)',
          },
          {
            label: 'Pilot',
            value: mockChallenges.filter(
              c => c.status === 'Pilot'
            ).length,
            color: 'var(--blue-400)',
          },
          {
            label: 'Draft',
            value: mockChallenges.filter(
              c => c.status === 'Draft'
            ).length,
            color: 'var(--gray-400)',
          },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-card)',
              border:
                '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.value}
            </span>

            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {view === 'table' ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Challenge ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Sector</th>
                <th>Budget</th>
                <th>Applications</th>
                <th>Shortlisted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <code
                      style={{
                        fontSize: 12,
                        color: 'var(--teal-400)',
                      }}
                    >
                      {c.id}
                    </code>
                  </td>

                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        maxWidth: 260,
                      }}
                    >
                      {c.title}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        marginTop: 2,
                      }}
                    >
                      Deadline: {c.deadline || 'TBD'}
                    </div>
                  </td>

                  <td
                    style={{
                      fontSize: 12.5,
                      color:
                        'var(--text-secondary)',
                      maxWidth: 160,
                    }}
                  >
                    {c.department}
                  </td>

                  <td>
                    <span
                      className="tag teal"
                      style={{ fontSize: 11 }}
                    >
                      {c.sector}
                    </span>
                  </td>

                  <td style={{ fontWeight: 600 }}>
                    {c.budget}
                  </td>

                  <td
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: 'var(--teal-400)',
                    }}
                  >
                    {c.applications}
                  </td>

                  <td
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: 'var(--green-400)',
                    }}
                  >
                    {c.shortlisted}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        statusColors[c.status] || ''
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td>
                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() =>
                          navigate(
                            `/gov/challenges/${c.id}`
                          )
                        }
                        title="View"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() =>
                          navigate(
                            `/gov/challenges/${c.id}/edit`
                          )
                        }
                        title="Edit"
                      >
                        <Edit size={13} />
                      </button>

                      {c.status === 'Draft' && (
                        <button
                          className="btn btn-sm btn-outline"
                          title="Publish"
                        >
                          <Globe size={13} />
                          Publish
                        </button>
                      )}

                      {c.applications > 0 && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            navigate(
                              `/gov/evaluation?challenge=${c.id}`
                            )
                          }
                          title="Applications"
                        >
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 16,
          }}
        >
          {filtered.map(c => (
            <div
              key={c.id}
              className="challenge-card"
              onClick={() =>
                navigate(
                  `/gov/challenges/${c.id}`
                )
              }
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
                {(c.problem || '').slice(0, 100)}
                ...
              </div>

              <div className="challenge-card-meta">
                <span className="challenge-meta-item">
                  🏛️{' '}
                  {(c.department || '')
                    .split(' ')
                    .slice(-3)
                    .join(' ')}
                </span>

                <span className="challenge-meta-item">
                  💰 {c.budget}
                </span>

                <span className="challenge-meta-item">
                  📅 {c.timeline}
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

                {(c.tags || [])
                  .slice(0, 2)
                  .map(tag => (
                    <span
                      key={tag}
                      className="tag"
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop:
                    '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color:
                          'var(--teal-400)',
                      }}
                    >
                      {c.applications}
                    </div>

                    <div
                      style={{
                        fontSize: 10,
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      Applications
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color:
                          'var(--green-400)',
                      }}
                    >
                      {c.shortlisted}
                    </div>

                    <div
                      style={{
                        fontSize: 10,
                        color:
                          'var(--text-muted)',
                      }}
                    >
                      Shortlisted
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-sm btn-primary"
                  onClick={e => {
                    e.stopPropagation();

                    navigate(
                      `/gov/challenges/${c.id}`
                    );
                  }}
                >
                  View
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            🎯
          </div>

          <div className="empty-state-title">
            No challenges found
          </div>

          <p style={{ marginBottom: 16 }}>
            Try adjusting your filters
          </p>

          <button
            className="btn btn-primary"
            onClick={() => {
              setSearch('');
              setSectorFilter('');
              setStatusFilter('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}