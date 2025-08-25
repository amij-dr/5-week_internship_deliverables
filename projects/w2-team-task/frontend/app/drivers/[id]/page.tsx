interface Params {
  params: {
    id: string
  }
}

async function getDriver(id: string) {
  const res = await fetch(`http://localhost:8000/api/drivers/${id}/profile`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch driver')
  }

  return res.json()
}

export default async function DriverProfile({ params }: Params) {
  const driver = await getDriver(params.id)

  const avgRating = driver.feedback.length
    ? (
        driver.feedback.reduce((sum: number, f: any) => sum + f.rating, 0) /
        driver.feedback.length
      ).toFixed(1)
    : 'N/A'

  const validCreds = driver.credentials.filter((c: any) => c.is_valid).length
  const invalidCreds = driver.credentials.length - validCreds

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{driver.name}'s Profile</h1>
      <p>License #: {driver.license_number}</p>
      <p>Birthdate: {driver.birthdate}</p>
      <p>Contact: {driver.contact}</p>

      <hr />

      <section>
        <h2 className="text-lg font-semibold">Drug Test Results</h2>
        {driver.drug_test_results.length === 0 ? (
          <p>No drug tests available.</p>
        ) : (
          <ul>
            {driver.drug_test_results.map((test: any) => (
              <li key={test.id}>
                {test.test_date} — {test.result}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Violations & Infractions</h2>
        <ul>
          {[...driver.violations, ...driver.infractions].map((item: any, index: number) => (
            <li key={index}>
              {item.date} — {item.description || item.incident}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Performance Rating</h2>
        <p>Average rating: {avgRating}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Credential Status</h2>
        <p>
          ✅ Valid: {validCreds} &nbsp;&nbsp; ❌ Invalid: {invalidCreds}
        </p>
      </section>
    </div>
  )
}
