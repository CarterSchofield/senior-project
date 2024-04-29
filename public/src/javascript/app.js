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
            customers: [],
            newReview: {
                content: ''
            },
            newCustomer: {
                name: '',
                email: ''
            },
            readReviews: true,
            writeReviews: false,
            user: {
                name: 'John Doe',
                email: 'carter.schofield',
                password: 'password'
            },
            business: {
                name: 'KareShield',
                address: '123 Main St',
                city: 'Anytown',
                state: 'NY',
                zip: '12345',
                phone: '123-456-7890',
                email: '',
            },
            workTypes: ['landscaping', 'concrete', 'framing', 'painting', 'electrical', 'plumbing', 'roofing', 'carpentry'],
            fNameSearchReviewFilter: '',
            lNameSearchReviewFilter: '',
            phoneSearchReviewFilter: '',
            addressSearchReviewFilter: '',
            workingTypeReviewFilter: '',
            customerFirstNameSearch: '',
            customerLastNameSearch: '',
            customerPhoneSearch: '',
            customerCitySearch: '',
            customerStateSearch: '',
            firstNameSearchFilter: '',
            lastNameSearchFilter: '',
            phoneNumberSearchFilter: '',
            emailSearchFilter: '',
            addressSearchFilter: '',
            zipCodeSearchFilter: '',
            citySearchFilter: '',
            customers: [],
            writeReviewOnCustomerPopup: false,

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
        },

        async loadReviews() {
            fetch("http://localhost:8080/reviews/", {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }).then((response) => {
                if (response.status == 200) {
                    response.json().then((data) => {
                        // checkUserAuthentication();
                        console.log("Reviews from server:", data);
                        this.reviews = data;
                    });
                } else {
                    console.log("Error loading reviews");
                }
            });
        },
        async searchReviews() {
            const url = new URL("http://localhost:8080/reviews/search");
            url.searchParams.append("customerFirstName", this.fNameSearchReviewFilter); // Append other parameters as needed
            url.searchParams.append("customerLastName", this.lNameSearchReviewFilter);
            url.searchParams.append("customerPhoneNumber", this.phoneSearchReviewFilter);
            // url.searchParams.append("customerCity", this.citySearchReviewFilter);
            url.searchParams.append("reviewWorkDone", this.workingTypeReviewFilter);
            console.log("Search URL:", url);
        
            fetch(url, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json", // Adjust as necessary, but usually not needed for GET
                }
            }).then((response) => {
                if (response.status == 200) {
                    response.json().then((data) => {
                        console.log("Reviews from server:", data);
                        this.reviews = data;
                    });
                } else {
                    console.log("Error loading reviews");
                }
            }).catch((error) => {
                console.error("Failed to load reviews:", error);
            });
        },

        clearSearchFilters(){
            this.fNameSearchReviewFilter = '';
            this.lNameSearchReviewFilter = '';
            this.phoneSearchReviewFilter = '';
            this.addressSearchReviewFilter = '';
            this.workingTypeReviewFilter = '';
        },

        createReview() {
            if (!this.validateReview()){
                console.log("Review is not valid");
                return;
            }

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;

            const data = new URLSearchParams();
            data.append('businessID', this.business._id);
            data.append('userID', this.user._id);
            data.append('customerID', this.customer._id);
            data.append('reviewDescription', this.reviewContent);
            data.append('rating', this.reviewRating);
            data.append('timestamp', today);
            data.append('reviewWorkDone', this.reviewWorkDone);

            console.log("Creating review with data:", data);
            fetch("http://localhost:8080/reviews/", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data
            }).then(response => {
                if (response.status === 201) {
                    console.log("Review created successfully");
                    this.getReviews();
                } else {
                    console.log("Error creating review");
                }
            }).catch(error => {
                console.log("Network error:", error);
            });
        },

        async customerSearch() {
            console.log("Searching for customer");
            const url = new URL("http://localhost:8080/customers/search");
                url.searchParams.append("firstName", this.customerFirstNameSearch);
                url.searchParams.append("lastName", this.customerLastNameSearch);
                url.searchParams.append("phoneNumber", this.customerPhoneSearch);
                // url.searchParams.append("city", this.customerCitySearch);
                // url.searchParams.append("state", this.customerStateSearch);
                
                fetch(url, {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    }
            }).then((response) => {
                if (response.status == 200) {
                    response.json().then((data) => {
                        console.log("Customer from server:", data);
                        this.customers = data;
                    });
                } else {
                    console.log("Error loading customer");
                }
            }).catch((error) => {
                console.error("Failed to load customer:", error);
            });
        },

        async writeReview(customer) {
            console.log("Writing review for customer:", customer);
            this.customer = customer;
            // this.writeReviewsPopup();
            this.writeReviewOnCustomerPopup = true;
            this.writeReviews = false;
        },

        submitReview() {
            console.log("Submitting review for customer:", this.customer);
            // this.createReview();
            // this.writeReviewOnCustomerPopup = false;
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
    },

    created() {
        console.log("App initialized");
    },
}).mount("#app");


