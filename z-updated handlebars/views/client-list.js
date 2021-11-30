function editButtonClicked(index) {
  window.location=`/client-edit-page?index=${index}`;
}

function addButtonClicked(index) {
  window.location='/client-add-page';
}

// let addToDoButton = document.getElementById(‘addToDo’);
// let toDoContainer = document.getElementById(‘toDoContainer’);
// let inputField = document.getElementById(‘inputField’);
// addToDoButton.addEventListener(‘click’, function() {
//     var paragraph = document.createElement(‘p’);
//     paragraph.innerHTML = inputField.value;
//     toDoContainer.appendChild(paragraph);
//     inputField.value = “”;
//     paragraph.addEventListener(‘dblclick’, function(){
//         toDoContainer.removeChild(paragraph);
//     })
// })
// 10:40
// the last line removes list item when you double click directly on the list item