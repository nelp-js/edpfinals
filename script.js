const postsAPI = "https://jsonplaceholder.typicode.com/posts";
    const usersAPI = "https://jsonplaceholder.typicode.com/users";
    let posts = [], users = [];

    async function fetchData() {
      const [postRes, userRes] = await Promise.all([
        fetch(postsAPI), fetch(usersAPI)
      ]);
      posts = await postRes.json();
      users = await userRes.json();
      populateAuthorFilter();
      renderPosts();
    }

    function getUserById(id) {
      return users.find(user => user.id === id);
    }

    function populateAuthorFilter() {
      const select = document.getElementById("authorFilter");
      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
      });
    }

    function renderPosts() {
      const container = document.getElementById("postsContainer");
      container.innerHTML = "";

      const titleSearch = document.getElementById("searchTitle").value.toLowerCase();
      const authorFilter = document.getElementById("authorFilter").value;

      const filteredPosts = posts.filter(post => {
        const user = getUserById(post.userId);
        return post.title.toLowerCase().includes(titleSearch) &&
               (authorFilter === "all" || post.userId == authorFilter);
      });

      filteredPosts.forEach(post => {
        const user = getUserById(post.userId);
        const col = document.createElement("div");
        col.className = "col-md-6";

        col.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title text-primary">${post.title}</h5>
              <p class="card-text">${post.body}</p>
              <button class="btn btn-outline-primary btn-sm" onclick="showUserModal(${user.id})">
                <i class="bi bi-person-lines-fill me-1"></i>${user.name}
              </button>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    }

    function showUserModal(userId) {
      const user = getUserById(userId);
      const details = document.getElementById("userDetails");

      details.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
      `;

      new bootstrap.Modal(document.getElementById("userModal")).show();
    }

    document.getElementById("searchTitle").addEventListener("input", renderPosts);
    document.getElementById("authorFilter").addEventListener("change", renderPosts);

    fetchData();