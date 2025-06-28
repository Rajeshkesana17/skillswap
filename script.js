const email = document.getElementById("email");
const password = document.getElementById("password");

window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};

window.signup = async () => {
  await createUserWithEmailAndPassword(auth, email.value, password.value);
};

window.logout = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, user => {
  document.getElementById("skill-form").style.display = user ? "block" : "none";
  if (user) findMatches(user.uid);
});

window.saveSkill = async () => {
  const skill = document.getElementById("yourSkill").value;
  const want = document.getElementById("wantSkill").value;

  await addDoc(collection(db, "skills"), {
    uid: auth.currentUser.uid,
    skill, want
  });

  findMatches(auth.currentUser.uid);
};

async function findMatches(uid) {
  const userSkillsSnap = await getDocs(query(collection(db, "skills"), where("uid", "==", uid)));
  let userData;
  userSkillsSnap.forEach(doc => userData = doc.data());

  if (!userData) return;

  const matchesSnap = await getDocs(query(
    collection(db, "skills"),
    where("skill", "==", userData.want),
    where("want", "==", userData.skill)
  ));

  const matchesDiv = document.getElementById("matches");
  matchesDiv.innerHTML = "<h3>Matches:</h3>";
  matchesSnap.forEach(doc => {
    const match = doc.data();
    matchesDiv.innerHTML += `<p>${match.skill} ↔️ ${match.want}</p>`;
  });
}
