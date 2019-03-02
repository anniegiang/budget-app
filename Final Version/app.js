// ------------------------------------------
// Budget Controller Module
// 1) Add the new item to our data structure
// 2) Calculate budget
// ------------------------------------------
// App Controller Module
// 1) Add event handler
// ------------------------------------------
// UI Controller Module 
// 1) Get input values
// 2) Add the new values to the UI
// 3) Update the UI
// ------------------------------------------

// Budget Controller Module
var BudgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
		
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			expense: [],
			income: []
		},

		totals: {
			expense: 0,
			income: 0
		},

		budget: 0,
		percentage: -1
	}

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.value;
		});
		data.totals[type] = sum;
	}

			
	return {
		addItem: function(type, description, value) {
			var newItem, ID;
			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			};
			
			// Create new item based on income or expense type
			if (type === "expense") {
				newItem = new Expense(ID, description, value);
			} else if (type === "income") {
				newItem = new Income(ID, description, value);
			};

			// Add new item to corresponding type array
			data.allItems[type].push(newItem);
			
			// Return the new Item
			return newItem;
		},

		deleteItem: function(type, ID) {
			var ids, index;

			// Returns an array of all the ids in order
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			// Finds the index of where the ID is located
			index = ids.indexOf(ID);

			data.allItems[type].splice(index, 1);

		},

		calculateBudget: function() {
			// Calculate total income and expenses
			calculateTotal("expense");
			calculateTotal("income");

			// Calculate budget = income - expenses
			data.budget = data.totals.income - data.totals.expense;

			// Calculate the percentage of income spent
			if (data.totals.income > 0) {
				data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);	
			} else {
				data.percentage = -1;
			}
			
		},

		calculatePercentages: function() {
			data.allItems.expense.forEach(function(current) {
				current.calcPercentage(data.totals.income);
			});
		},

		getPercentages: function() {
			var allPercentages = data.allItems.expensei(function(current) {
				return current.getPercentage();
			});
			return allPercentages;
		},

		getBudget: function() {
			return {
				totalIncome: data.totals.income,
				totalExpenses: data.totals.expense,
				budget: data.budget,
				percentage: data.percentage
			}
		},


		testing: function () {
			console.log(data);
		}
	}



})();


// UI Controller Module 
var UIController = (function() {
	var Selectors = {
		addBtn: document.querySelector(".add__btn"),
		type: document.querySelector(".add__type"),
		description: document.querySelector(".add__description"),
		value: document.querySelector(".add__value"),
		incomeContainer: document.querySelector(".income__list"),
		expensesContainer: document.querySelector(".expenses__list"),
		budgetDisplay: document.querySelector(".budget__value"),
		incomeDisplay: document.querySelector(".budget__income--value"),
		expenseDisplay: document.querySelector(".budget__expenses--value"),
		percentageDisplay: document.querySelector(".budget__expenses--percentage"),
		container: document.querySelector(".container"),
		itemPercentage: document.querySelectorAll(".item__percentage"),
		dateDisplay: document.querySelector(".budget__title--month")
	};

	var nodeListForEach = function(list, callback) { // regular forEach does not work for nodeLists
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};

	var formatNumber = function(num, type) {
			var numSplit, int, dec;
			// + or - before number
			// exactly 2 decimal points
			// comma seperating thousands

			num = Math.abs(num);
			num = num.toFixed(2); //gives back a string and not an integer

			numSplit = num.split(".");
			int = numSplit[0];
			dec = numSplit[1];

			if (int.length > 3) {
				int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); 
			}

			return (type === "expense" ? "- " : "+ ") + int + "." + dec;
		};

			
	return {
		getSelectors: function() {
			return Selectors;
		},

		getInput: function() {
			return {
				type: Selectors.type.value,
				description: Selectors.description.value,
				value: parseFloat(Selectors.value.value)
			};
		},

		addListItem: function(object, type) {
			var html, newHtml, element;
			// Create HTMl string with placeholder text
			if (type === "income") {
				element = Selectors.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%""><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === "expense") {
				element = Selectors.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			};	

			// Replace the placeholder text with some actual data
			newHtml = html.replace("%id%", object.id);
			newHtml = newHtml.replace("%description%", object.description);
			newHtml = newHtml.replace("%value%", formatNumber(object.value, type));

			// Insert the HTML into the DOM
			element.insertAdjacentHTML("beforeend", newHtml);
		},

		deleteListItem: function(selectorID) {
			var element;
			element = document.getElementById(selectorID);
			element.parentNode.removeChild(element);
		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(".add__description" + ", " + ".add__value");
			fieldsArr = Array.prototype.slice.call(fields); //convert list into array, first need to trick that it's a an array 

			fieldsArr.forEach(function(current, index, array) {
				current.value = ""; //current represents description and value
			});

			// Selectors.type.value = "income";
			Selectors.description.focus();
		},

		displayBudget: function(object) {
			var type;

			object.budget > 0 ? type = "income" : type = "expense";

			Selectors.budgetDisplay.textContent = formatNumber(object.budget, type);
			Selectors.incomeDisplay.textContent = formatNumber(object.totalIncome, "income");
			Selectors.expenseDisplay.textContent = formatNumber(object.totalExpenses, "expense");
			if (object.percentage > 0) {
				Selectors.percentageDisplay.textContent = object.percentage + "%";
			} else {
				Selectors.percentageDisplay.textContent = "---";
			}					
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(".item__percentage"); //nodeList
 
			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + "%";
				} else {
					current.textContent = "---";
				}
				
			});
		},

		displayMonth: function() {
			var now, year, month, formatter;

			now = new Date(); //no arguements returns today's date

			// month = now.getMonth();

			year = now.getFullYear();

			formatter = new Intl.DateTimeFormat("en", { month: "long" });

			month = formatter.format(now);

			Selectors.dateDisplay.textContent = month + " " + year;
		},

		changedType: function() {
			var fields;
			fields = document.querySelectorAll(
				".add__type" + ", " + 
				".add__description" + ", " + 
				".add__value");
			
			nodeListForEach(fields, function(current) {
				current.classList.toggle("red-focus");
			});

			Selectors.addBtn.classList.toggle("red");
		}
	};
})();

// App Controller Module
var AppController = (function(budgetCtrl, UICtrl) {

	var setUpEventListener = function() {
		var Selectors = UICtrl.getSelectors();

		Selectors.type.addEventListener("change", UICtrl.changedType);

		Selectors.container.addEventListener("click", ctrlDeleteItem);

		Selectors.addBtn.addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			};
		});
	};

	var updateBudget = function() {
		var budget;
		// 1. Calculate budget
		budgetCtrl.calculateBudget();

		// 2. Return budget		
		budget = budgetCtrl.getBudget();
		
		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);

	};

	var updatePercentages = function() {

		// 1. Calulate percentages
		budgetCtrl.calculatePercentages();

		// 2. Read them from budget controller
		var percentages = budgetCtrl.getPercentages();

		// 3. Update UI with new percentages
		UICtrl.displayPercentages(percentages);
	}

	var ctrlAddItem = function() {
		var input, newItem;
		// 1. Get the field input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. Add the new item to our data structure
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the new values to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields
			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();

			// 6. Calculate and update percentages
			updatePercentages();

		}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID, index;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if (itemID) {
			splitID = itemID.split("-");
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete from data structure
			index = budgetCtrl.deleteItem(type, ID);

			// 2. Delete from UI
			UICtrl.deleteListItem(itemID);

			// 3. Update and show new totals
			updateBudget();

			// 4. Calculate and update percentages
			updatePercentages();

		}
	}

	return {
		init: function() {
			console.log("Application has started");
			setUpEventListener();
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				totalIncome: 0,
				totalExpenses: 0,
				budget: 0,
				percentage: -1
			});
		}
	};

})(BudgetController, UIController);

AppController.init();


