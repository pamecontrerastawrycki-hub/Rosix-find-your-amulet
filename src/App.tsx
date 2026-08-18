import { Navigate, Route, Routes } from 'react-router-dom';
import { QuizPage } from './routes/QuizPage';
import { ResultPage } from './routes/ResultPage';
import { CustomizePage } from './routes/CustomizePage';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the quiz
      </a>

      <main id="main">
        <Routes>
          <Route path="/" element={<QuizPage />} />
          <Route path="/result/:slug" element={<ResultPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          {/* Anything unknown lands on the intro rather than a dead end. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
