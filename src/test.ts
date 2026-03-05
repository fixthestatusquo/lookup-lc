const email = process.argv[2];

if (!email) {
  console.error("Usage: ts-node src/test.ts <email>");
  process.exit(1);
}

const testLookup = async (email: string) => {
  try {
    const res = await fetch(
      `http://localhost:5001/lookup?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      },
    );

    const data = await res.json();
    console.log("Response for", email, ":", data);
  } catch (err) {
    console.error("Error calling lookup:", err);
  }
};

testLookup(email);
