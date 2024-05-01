// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'https://senior-project-h200.onrender.com/'
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
                name: '',
                email: ''
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
            inputtedEmail: '',
            inputtedPassword: '',
            signedInUsersName: '',
            signedInBusinessName: '',
            errorMessages: {},
            failedLogin: false,
            hasEmail: true,
            hasPassword: true,
            animationKey: 0,
            hasEmailReg: true,
            hasPasswordReg: true,
            hasPasswordConfirmReg: true,
            newUserEmail: '',
            newUserPassword: '',
            newUserConfirmPassword: '',
            registerPage1: true,
            registerPage2: false,
            registerPage3: false,
            newUserFirstName: '',
            newUserLastName: '',
            newUserPhone: '',
            hasFirstName: true,
            hasLastName: true,
            hasPhone: true,
            hasBusinessName: true,
            hasBusinessPhone: true,
            hasAddress: true,
            hasCity: true,
            hasState: true,
            hasZip: true,
            newBusinessName: '',
            newBusinessPhone: '',
            newBusinessAddress: '',
            newBusinessCity: '',
            newBusinessState: '',
            newBusinessZip: '',
            

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
        // login() {
        //     console.log("Logging in");
        //     this.userNotSignedIn = false;
        //     localStorage.setItem('userNotSignedIn', 'false'); // Store login state in local storage
        //     window.location.href = "index.html";
        // },
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
            fetch(`${BASE_URL}/reviews/`, {
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
            const url = new URL(`${BASE_URL}/reviews/search`);
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
            fetch(`${BASE_URL}/reviews/`, {
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
            const url = new URL(`${BASE_URL}/customers/search`);
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
        },
        login() {
            console.log("Logging in");
            if (!this.validateUserLogin()) {
                console.log("Invalid login");
                this.handleLoginInput();
                return;
            }
            var data = "email=" + encodeURIComponent(this.inputtedEmail);
            data += "&plainPassword=" + encodeURIComponent(this.inputtedPassword);
            fetch(`${BASE_URL}/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data,
                credentials: 'include',
            }).then(response => {
                if (response.ok) {
                    console.log("Login successful");
                    localStorage.setItem('userNotSignedIn', 'false');
                    this.userNotSignedIn = false;
                    this.inputtedEmail = '';
                    this.inputtedPassword = '';
                    window.location.replace(`${BASE_URL}/dashboard.html`);
                    this.failedLogin = false;
                    this.loadSession();
                } else {
                    //TODO - handle login failure like midterm
                    // throw new Error('Login failed!');
                    this.handleLoginInput();
                    this.failedLogin = true;
                }
            })
            .catch(error => {
                this.handleLoginInput();
                console.error("Login error:", error);
                alert("Login failed: " + error.message);
            });
        },

        loadSession() {
            fetch(`${BASE_URL}/session`)
                .then(response => {
                    if (response.status === 200 && response.headers.get("Content-Length") !== "0") {
                        response.json().then(data => {
                            this.userNotSignedIn = false;
                            this.signedInUsersName = data.firstName; // Assuming the response includes a "firstName" field
                            this.signedInBusinessName = data.businessName;
                            localStorage.setItem('signedInUsersName', data.firstName);
                            localStorage.setItem('signedInBusinessName', data.businessName);
                        }).catch(jsonError => {
                            console.error("Error parsing JSON:", jsonError);
                        });
                    } else {
                        console.log("No active session or user not signed in");
                        // window.location.href = '/login.html'; // Uncomment to redirect when appropriate
                    }
                })
                .catch(error => {
                    console.error("Error loading session:", error);
                });
        },

        logout() {
            fetch(`${BASE_URL}/logout`, {
                method: 'GET'
            }).then(response => {
                if (response.ok) {
                    this.userNotSignedIn = true;
                    localStorage.setItem('userNotSignedIn', 'true');
                    console.log("Logout successful");
                    window.location.replace(`${BASE_URL}/login.html?type=login`);
                } else {
                    console.error("Logout failed");
                }
            }).catch(error => {
                console.error("Error during logout:", error);
            });
        },

        errorMessageForField: function(fieldName) {
            return this.errorMessages[fieldName];
        },

        errorStyleForField: function(fieldName) {
            if (this.errorMessages[fieldName]) {
                return {
                    color: "red",
                };
            }
        },

        handleLoginInput() {
            // Reset flags on any input to remove error indications
            this.hasEmail = !!this.inputtedEmail;
            this.hasPassword = !!this.inputtedPassword;
            this.failedLogin = false;
            this.animationKey++;  // Increment key to re-trigger animations
    
            // Remove the shake class to reset the animation
            const emailField = document.getElementById('loginEmail');
            const passwordField = document.getElementById('loginPassword');
            if (emailField) emailField.classList.remove('shake');
            if (passwordField) passwordField.classList.remove('shake');
    
            // Use Vue.nextTick to re-add the shake class if necessary
            this.$nextTick(() => {
                if (!this.hasEmail && this.inputtedEmail !== '') {
                    emailField.classList.add('shake');
                }
                if (!this.hasPassword && this.inputtedPassword !== '') {
                    passwordField.classList.add('shake');
                }
            });
        },

        handleRegisterInput1() {
            // Reset flags on any input to remove error indications
            this.hasEmailReg = !!this.newUserEmail;
            this.hasPasswordReg = !!this.newUserPassword;
            this.hasPasswordConfirmReg = !!this.newUserConfirmPassword;
            this.failedLogin = false;
            this.animationKey++;  // Increment key to re-trigger animations
    
            // Remove the shake class to reset the animation
            const emailField = document.getElementById('email');
            const passwordField = document.getElementById('password');
            const passwordConfirmField = document.getElementById('password-confirm');
            if (emailField) emailField.classList.remove('shake');
            if (passwordField) passwordField.classList.remove('shake');
            if (passwordConfirmField) passwordConfirmField.classList.remove('shake');
    
            // Use Vue.nextTick to re-add the shake class if necessary
            this.$nextTick(() => {
                if (!this.hasEmailReg && this.newUserEmail !== '') {
                    emailField.classList.add('shake');
                }
                if (!this.hasPasswordReg && this.newUserPassword !== '') {
                    passwordField.classList.add('shake');
                }
                if (!this.hasPasswordConfirmReg && this.newUserConfirmPassword !== '') {
                    passwordConfirmField.classList.add('shake');
                }
            });
        },

        //* Complete Registration
        completeRegistration() {
            console.log("Completing registration");
            if (!this.validateUserRegisterPage3()) {
                console.log("Invalid registration");
                return;
            }
            var data = "primaryContactEmail=" + encodeURIComponent(this.newUserEmail);
            data += "&plainPassword=" + encodeURIComponent(this.newUserPassword);
            data += "&adminUsersFirstName=" + encodeURIComponent(this.newUserFirstName);
            data += "&adminUsersLastName=" + encodeURIComponent(this.newUserLastName);
            data += "&phoneNumber=" + encodeURIComponent(this.newUserPhone);
            data += "&businessName=" + encodeURIComponent(this.newBusinessName);
            data += "&businessPhoneNumber=" + encodeURIComponent(this.newBusinessPhone);
            data += "&businessMailingAddress=" + encodeURIComponent(this.newBusinessAddress);
            data += "&businessCity=" + encodeURIComponent(this.newBusinessCity);
            data += "&businessState=" + encodeURIComponent(this.newBusinessState);
            data += "&businessZipCode=" + encodeURIComponent(this.newBusinessZip);
            var  businessPrivacyAgreement = 'true';
            data += "&businessPrivacyAgreement=" + encodeURIComponent(businessPrivacyAgreement);

            fetch(`${BASE_URL}/businesses/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data,
            }).then(response => {
                if (response.ok) {
                    console.log("Registration successful");
                    localStorage.setItem('userNotSignedIn', 'false');
                    this.signedInUsersName = this.newUserFirstName; // Assuming the response includes a "firstName" field
                    this.signedInBusinessName = this.newBusinessName;
                    localStorage.setItem('signedInUsersName', this.newUserFirstName);
                    localStorage.setItem('signedInBusinessName', this.newBusinessName);
                    this.userNotSignedIn = false;
                    this.newUserEmail = '';
                    this.newUserPassword = '';
                    this.newUserConfirmPassword = '';
                    this.newUserFirstName = '';
                    this.newUserLastName = '';
                    this.newUserPhone = '';
                    this.newBusinessName = '';
                    this.newBusinessPhone = '';
                    this.newBusinessAddress = '';
                    this.newBusinessCity = '';
                    this.newBusinessState = '';
                    this.newBusinessZip = '';
                    window.location.replace(`${BASE_URL}/dashboard.html`);
                    this.failedLogin = false;
                    this.loadSession();
                } else {
                    // throw new Error('Login failed!');
                    this.handleRegisterInput1();
                    this.failedLogin = true;
                }
            })
        },

        //* Go to next registration page
        //note: move to registration page 2
        registerNext() {
            console.log("Registering page 1");
            if (!this.validateUserRegisterPage1()) {
                console.log("Invalid registration");
                return;
            }
            // this.newUserEmail = '';
            // this.newUserPassword = '';
            // this.newUserConfirmPassword = '';
            console.log("Valid registration step 1");
            this.registerPage1 = false;
            this.registerPage2 = true;
            this.registerPage3 = false;
        },
        //note: move to registration page 3
        registerNext2() {
            console.log("Registering page 2");
            if (!this.validateUserRegisterPage2()) {
                console.log("Invalid registration");
                return;
            }
            // this.newUserEmail = '';
            // this.newUserPassword = '';
            // this.newUserConfirmPassword = '';
            console.log("Valid registration step 2");
            this.registerPage1 = false;
            this.registerPage2 = false;
            this.registerPage3 = true
        },

        //* Go back to the previous registration page
        registerBack1() {
            this.registerPage1 = true;
            this.registerPage2 = false;
            this.registerPage3 = false;
        },
        registerBack2() {
            this.registerPage1 = false;
            this.registerPage2 = true;
            this.registerPage3 = false;
        },


        //* Validate HTML Fields
        //note: Validation for the user login page
        validateUserLogin() {
            this.errorMessages = {};
            if (this.inputtedEmail.length < 1) {
                this.errorMessages.inputtedEmail = 'EMAIL - REQUIRED';
                this.hasEmail = false;
            }
            if (this.inputtedPassword.length < 1) {
                this.errorMessages.inputtedPassword = 'PASSWORD - REQUIRED';
                this.hasPassword = false;
            }
            return Object.keys(this.errorMessages).length == 0;
        },

        //note: Validation for the user registration page 1
        //- checks user email, password, and password confirmation
        validateUserRegisterPage1() {
            this.errorMessages = {};
            if (this.newUserEmail.length < 1) {
                this.errorMessages.newUserEmail = 'EMAIL - REQUIRED';
                this.hasEmailReg = false;
            }
            if (this.newUserEmail.includes('@') === false || this.newUserEmail.includes('.') === false) {
                this.errorMessages.newUserEmail = 'EMAIL - INVALID FORMAT';
                this.hasEmailReg = false;
            }
            if (this.newUserPassword.length < 1) {
                this.errorMessages.newUserPassword = 'PASSWORD - REQUIRED';
                this.hasPasswordReg = false;
            }
            if (this.newUserConfirmPassword.length < 1) {
                this.errorMessages.newUserPasswordConfirm = 'CONFIRM PASSWORD - REQUIRED';
                this.hasPasswordConfirmReg = false;
            }
            if (this.newUserPassword !== this.newUserConfirmPassword) {
                this.errorMessages.newUserPasswordConfirm  = 'PASSWORDS DO NOT MATCH';
                this.hasPasswordConfirmReg = false;
            }
            return Object.keys(this.errorMessages).length == 0;
        },

        //note: Validation for the user registration page 2
        //- checks user first name, last name, and phone number
        validateUserRegisterPage2() {
            this.errorMessages = {};
            if (this.newUserFirstName.length < 1) {
                this.errorMessages.newUserFirstName = 'FIRST NAME - REQUIRED';
                this.hasFirstName = false;
            }
            if (this.newUserLastName.length < 1) {
                this.errorMessages.newUserLastName = 'LAST NAME - REQUIRED';
                this.hasLastName = false;
            }
            // strip non-numeric characters from phone number
            this.newUserPhone = this.newUserPhone.replace(/\D/g, '');
            if (isNaN(this.newUserPhone)) {
                console.log(this.newUserPhone)
                this.errorMessages.newUserPhone = 'PHONE NUMBER - MUST BE A NUMBER';
                this.hasPhone = false;
            }
            // check that phone number is 10 digits
            if (this.newUserPhone.length !== 10) {
                this.errorMessages.newUserPhone = 'PHONE NUMBER - INVALID FORMAT';
                this.hasPhone = false;
            }
            return Object.keys(this.errorMessages).length == 0;
        },

        //note: Validation for the user registration page 3
        //- checks business name, business phone number, address, city, state, zip code
        validateUserRegisterPage3() {
            this.errorMessages = {};
            if (this.newBusinessName.length < 1) {
                this.errorMessages.newBusinessName = 'BUSINESS NAME - REQUIRED';
                this.hasBusinessName = false;
            }
            // strip non-numeric characters from phone number
            this.newBusinessPhone = this.newBusinessPhone.replace(/\D/g, '');
            if (isNaN(this.newBusinessPhone)) {
                this.errorMessages.newBusinessPhone = 'PHONE NUMBER - MUST BE A NUMBER';
                this.hasBusinessPhone = false;
            }
            // check that phone number is 10 digits
            if (this.newBusinessPhone.length !== 10) {
                this.errorMessages.newBusinessPhone = 'PHONE NUMBER - INVALID FORMAT';
                this.hasBusinessPhone = false;
            }
            if (this.newBusinessAddress.length < 1) {
                this.errorMessages.newBusinessAddress = 'ADDRESS - REQUIRED';
                this.hasAddress = false;
            }
            if (this.newBusinessCity.length < 1) {
                this.errorMessages.newBusinessCity = 'CITY';
                this.hasCity = false;
            }
            if (this.newBusinessState.length < 1) {
                this.errorMessages.newBusinessState = 'STATE';
                this.hasState = false;
            }
            // strip non-numeric characters from zip code
            this.newBusinessZip = this.newBusinessZip.replace(/\D/g, '');
            if (isNaN(this.newBusinessZip)) {
                this.errorMessages.newBusinessZip = 'ZIP CODE - MUST BE A NUMBER';
                this.hasZip = false;
            }
            // check that zip code is 5 digits
            if (this.newBusinessZip.length !== 5) {
                this.errorMessages.newBusinessZip = 'ZIP CODE - INVALID FORMAT';
                this.hasZip = false;
            }
            return Object.keys(this.errorMessages).length == 0;
        },




    },


    mounted() {
        this.loadSession();
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
        // console.log("App initialized");
    },
}).mount("#app");


