import { http } from './http';
import { ui } from './ui';
// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts)

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPosts)

// Listen for delete post
document.querySelector('#posts').addEventListener('click', deletePost)

// Listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit)

// Listen for cancel
document.querySelector('.card-form').addEventListener('click', cancelEdit)
// Get Posts
function getPosts() {
  http.get('http://localhost:3000/posts')
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err))
}

// Submit Posts
function submitPosts() {
  const title = document.querySelector('#title').value
  const body = document.querySelector('#body').value
  const id = document.querySelector('#id').value
  if (title && body) {
    const data = {
      title,
      body
    }
    // check for ID
    if (id === 'nothing') {
      // Create POST
      http.post('http://localhost:3000/posts', data)
      .then(data => {
        ui.showAlert('Post added', 'alert alert-success')
        ui.clearFields()
        getPosts()
      })
      .catch(err => console.log(err))
    } else {
      // Update Post
      http.put(`http://localhost:3000/posts/${id}`, data)
      .then(data => {
        ui.showAlert('Post Update', 'alert alert-success')
        ui.changeFormState('add')
        getPosts()
      })
      .catch(err => console.log(err))
    }
  } else {
    ui.showAlert('Please fill in all fields', 'alert alert-danger')
  }
}

// Delete
function deletePost(e) {
  e.preventDefault();
  if(e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id
    if(confirm('Are you sure???')) {
      http.delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert('Post Removed', 'alert alert-success');
          getPosts()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}

// Enable Edit State
function enableEdit(e) {
  if(e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id
    const body = e.target.parentElement.previousElementSibling.textContent
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent

    const data = {
      id,
      title,
      body
    }

    // Fill form with current posts
    ui.fillForm(data)
  }
  e.preventDefault()
}

// Cancel Edit State
function cancelEdit(e) {
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add')
  }
  e.preventDefault()
}