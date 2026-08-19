This directory is intended to be a git submodule pointing to:

https://github.com/Siddheshh21/Federated-Learning--Fraud-Detection--v1.git

Notes for contributors / maintainers:

- I added a .gitmodules file on the add-backend branch indicating the intended submodule, and this README with instructions.
- A true submodule (a gitlink entry under `backend/` that records the backend repo commit) cannot be created purely via the GitHub content API from here. To complete the submodule integration you (or any maintainer) should run the following locally:

  git checkout add-backend
  git submodule add https://github.com/Siddheshh21/Federated-Learning--Fraud-Detection--v1.git backend
  git commit -m "Add backend submodule"
  git push origin add-backend

- After that, other contributors can clone and initialize the submodule with:

  git clone --recurse-submodules https://github.com/Daredevil2311/AAFL.git
  # or, if already cloned:
  git submodule init
  git submodule update

If you want, I can also copy the backend files into backend/ here (files-only) in the same branch so the code is immediately available without requiring a separate submodule init step — tell me and I'll add them as well.
