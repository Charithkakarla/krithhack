import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react'
import { getStudentTest, submitStudentTest } from '../../services/studentApi'

function getTestIdFromHash() {
  const match = window.location.hash.match(/#\/test\/([^/?]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export default function TestAttemptView() {
  const testId = useMemo(() => getTestIdFromHash(), [])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [testData, setTestData] = useState(null)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    let cancelled = false

    async function loadTest() {
      try {
        setLoading(true)
        const data = await getStudentTest(testId)
        if (cancelled) {
          return
        }
        setTestData(data)
        setAnswers(Array.from({ length: data.questions?.length || 0 }, () => ''))
      } catch {
        if (!cancelled) {
          setError('This test link is invalid or expired.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (testId) {
      loadTest()
    } else {
      setError('Missing test link.')
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [testId])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!testData) {
      return
    }

    setSaving(true)
    setError('')
    try {
      const result = await submitStudentTest(testId, answers)
      setSuccess(
        `Submitted successfully. Score ${result.score}/${result.max_score} (${result.percentage}%). The report has been sent on WhatsApp.`,
      )
    } catch {
      setError('Could not submit the test. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="test-attempt-shell">
        <div className="panel test-attempt-card centered-state">
          <Loader2 size={22} className="spinner" />
          <p>Loading test...</p>
        </div>
      </div>
    )
  }

  if (error && !testData) {
    return (
      <div className="test-attempt-shell">
        <div className="panel test-attempt-card centered-state">
          <p className="error-text">{error}</p>
          <button className="generate-btn" type="button" onClick={() => (window.location.hash = '')}>
            <ArrowLeft size={16} />
            Back to school app
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="test-attempt-shell">
      <div className="panel test-attempt-card">
        <div className="attempt-header">
          <div>
            <p className="eyebrow">{testData?.subject || 'General'}</p>
            <h2>{testData?.student_name || 'Student'} Test</h2>
            <p>Answer all questions and submit the paper to generate the report automatically.</p>
          </div>
          <button className="ghost-btn" type="button" onClick={() => (window.location.hash = '')}>
            <ArrowLeft size={16} />
            Exit
          </button>
        </div>

        <form className="attempt-form" onSubmit={handleSubmit}>
          {testData.questions.map((question, index) => (
            <section key={`${question.question}-${index}`} className="question-card">
              <h3>
                Q{index + 1}. {question.question}
              </h3>
              <div className="option-list">
                {question.options.map((option) => (
                  <label key={option} className="option-row">
                    <input
                      type="radio"
                      name={`q${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => {
                        const next = [...answers]
                        next[index] = option
                        setAnswers(next)
                      }}
                      required
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="attempt-footer">
            <button className="generate-btn" type="submit" disabled={saving}>
              {saving ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
              Submit Test
            </button>
            {success ? (
              <p className="success-text">
                <CheckCircle2 size={14} /> {success}
              </p>
            ) : null}
            {error ? <p className="error-text">{error}</p> : null}
          </div>
        </form>
      </div>
    </div>
  )
}