import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { VisitorLayout } from './visitor/VisitorLayout';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLoginView } from './admin/views/AdminLoginView';
import { AdminDashboardView } from './admin/views/AdminDashboardView';
import { ArtifactsManageView } from './admin/views/ArtifactsManageView';
import { AudioManageView } from './admin/views/AudioManageView';
import { FloorMapEditorView } from './admin/views/FloorMapEditorView';
import { SessionManageView } from './admin/views/SessionManageView';
import { AnalyticsView } from './admin/views/AnalyticsView';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Visitor Experience (Khách Vãng Lai) */}
      <Route path="/" element={<VisitorLayout />} />

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginView />} />

      {/* Admin Dashboard Protected Area */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardView />} />
        <Route path="artifacts" element={<ArtifactsManageView />} />
        <Route path="audio" element={<AudioManageView />} />
        <Route path="maps" element={<FloorMapEditorView />} />
        <Route path="sessions" element={<SessionManageView />} />
        <Route path="analytics" element={<AnalyticsView />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
