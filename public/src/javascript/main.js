document.addEventListener('DOMContentLoaded', function () {
    var toggleUserMenu = document.getElementById('toggleUserMenu');
    if (toggleUserMenu) {
        toggleUserMenu.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the link from following the URL
            var userMenu = document.getElementById('userMenu');
            if (userMenu.style.display === 'block') {
                userMenu.style.display = 'none';
            } else {
                userMenu.style.display = 'block';
            }
        });
    } else {
        console.log('Element with ID toggleUserMenu not found');
    }
});




document.addEventListener("DOMContentLoaded", function() {
    const queryParams = new URLSearchParams(window.location.search);
    const type = queryParams.get('type'); // Get the value of the 'type' parameter

    // Now you can use the 'type' variable safely within this block
    console.log('Type from URL:', type);

    // You might want to do different things based on the type
    if (type === 'login') {
        // Execute login related code
        console.log('Prepare login form');
    } else {
        // Handle other cases or default behavior
        console.log('Handle other types or default case');
    }
});