Vue.createApp({
    data() {
        return {
            type: '', // Variable to store the type of page (register or login)
            userNotSignedIn: true, // Variable to indicate if the user is not signed in
            reviews: [],
            filter: {
                name: '',
                date: ''
            },
            customerSearch: '',
            customer: null,
            newReview: {
                content: ''
            },
            newCustomer: {
                name: '',
                email: ''
            },
            readReviews: true,
            writeReviews: true,
        };
    },
    methods: {
        registerPageNavigate() {
            // Redirect to login.html with type=register parameter
            window.location.href = "login.html?type=register";
        },
        loginPageNavigate() {
            // Redirect to login.html with type=login parameter
            window.location.href = "login.html?type=login";
        },
        // You can define other methods here as needed
        login() {
            console.log("Logging in");
            this.userNotSignedIn = false;
            localStorage.setItem('userNotSignedIn', 'false'); // Store login state in local storage
            window.location.href = "index.html";
        },
        logout() {
            this.userNotSignedIn = true;
            localStorage.setItem('userNotSignedIn', 'true'); // Update login state in local storage
        },
        writeReviewsPopup() {
            this.readReviews = false;
            this.writeReviews = true;
        },
        readReviewsPopup() {
            this.readReviews = true;
            this.writeReviews = false;
            this.getReviews();
        },
        getFilteredReviews() {
            axios.get('/reviews?name=${this.filter.name}&date=${this.filter.date}')
                 .then(response => {
                     this.reviews = response.data;
                 })
                 .catch(error => console.error('Error fetching reviews:', error));
        },
        searchCustomer() {
            axios.get('/customers/search?name=${this.customerSearch}')
                 .then(response => {
                     this.customer = response.data[0]; // assuming the first match
                 })
                 .catch(error => {
                     console.error('Error searching customer:', error);
                     this.customer = null;
                 });
        },
        createCustomer() {
            axios.post('/customers', this.newCustomer)
                 .then(response => {
                     this.customer = response.data;
                     this.submitReview();
                 })
                 .catch(error => console.error('Error creating customer:', error));
        },
        submitReview() {
            const reviewData = {
                customerID: this.customer.id,
                content: this.newReview.content
            };
            axios.post('/reviews', reviewData)
                 .then(response => {
                     this.reviews.push(response.data);
                 })
                 .catch(error => console.error('Error submitting review:', error));
        },
        getReviews() {
            axios.get('/reviews')
                 .then(response => {
                     this.reviews = response.data;
                 })
                 .catch(error => console.error('Error fetching reviews:', error));
        }
        
    },
        
    mounted() {
        // When the Vue app is mounted, check the URL parameter to determine the type
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');

        // Update the type in the Vue data
        if (type === 'register' || type === 'login') {
            this.type = type;
        }
        // Check local storage to set initial login state
        if (localStorage.getItem('userNotSignedIn') === 'false') {
            this.userNotSignedIn = false;
        }
    }


}).mount("#app");


