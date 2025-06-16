import React, { useState, useEffect } from 'react';
import './Notifications.scss';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Dummy data for now, will fetch from backend later
    const dummyData = [
      { id: 1, type: 'like', user: 'Stylista33', msg: 'liked your outfit!', time: '2m ago' },
      { id: 2, type: 'comment', user: 'KomalDhiman', msg: 'slaying fr 👑', time: '5m ago' },
      { id: 3, type: 'save', user: 'FashionQueen', msg: 'saved your winter fit ❄️', time: '12m ago' },
      { id: 4, type: 'follow', user: 'NewChic', msg: 'started following you 💫', time: '1h ago' },
    ];
    setNotifications(dummyData);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'save': return '📌';
      case 'follow': return '➕';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <div className="notif-list">
        {notifications.map((note) => (
          <div key={note.id} className="notif-card">
            <span className="icon">{getIcon(note.type)}</span>
            <div className="notif-info">
              <strong>@{note.user}</strong> {note.msg}
              <div className="notif-time">{note.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
