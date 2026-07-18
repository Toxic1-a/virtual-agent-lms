import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AgentCueProvider } from './context/AgentCueContext'
import { AgentModeProvider } from './context/AgentModeContext'
import { ProgressProvider } from './context/ProgressContext'
import { SoundProvider } from './context/SoundContext'
import { ActivityPage } from './pages/ActivityPage'
import { AuthorsPage } from './pages/AuthorsPage'
import { Completion } from './pages/Completion'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import { LessonPage } from './pages/LessonPage'
import { ModulePage } from './pages/ModulePage'
import { QuizPage } from './pages/QuizPage'

export default function App() {
  return (
    <SoundProvider>
      <AgentModeProvider>
        <ProgressProvider>
          <AgentCueProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authors" element={<AuthorsPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/modules/:moduleId" element={<ModulePage />} />
                <Route path="/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/activities/:activityId" element={<ActivityPage />} />
                <Route path="/quizzes/:quizId" element={<QuizPage />} />
                <Route path="/completion" element={<Completion />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AgentCueProvider>
        </ProgressProvider>
      </AgentModeProvider>
    </SoundProvider>
  )
}
