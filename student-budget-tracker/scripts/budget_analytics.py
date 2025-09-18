import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

def analyze_student_budget(budget_data):
    """
    Analyze student budget data using Python data analytics tools
    """
    
    # Convert budget data to pandas DataFrame for analysis
    categories_df = pd.DataFrame.from_dict(budget_data['categories'], orient='index')
    categories_df['utilization'] = (categories_df['spent'] / categories_df['budget']) * 100
    categories_df['remaining'] = categories_df['budget'] - categories_df['spent']
    
    # Expenses analysis
    expenses_df = pd.DataFrame(budget_data['recentExpenses'])
    if not expenses_df.empty:
        expenses_df['date'] = pd.to_datetime(expenses_df['date'])
        expenses_df['amount_inr'] = expenses_df['amount'] * 83  # Convert USD to INR
    
    # Calculate key metrics
    total_budget_inr = budget_data['totalBudget'] * 83
    total_spent_inr = budget_data['totalSpent'] * 83
    savings_rate = ((total_budget_inr - total_spent_inr) / total_budget_inr) * 100
    
    # Category-wise analysis
    high_spending_categories = categories_df[categories_df['utilization'] > 80].index.tolist()
    low_spending_categories = categories_df[categories_df['utilization'] < 30].index.tolist()
    
    # Generate insights
    insights = {
        'total_budget_inr': total_budget_inr,
        'total_spent_inr': total_spent_inr,
        'savings_rate': savings_rate,
        'high_spending_categories': high_spending_categories,
        'low_spending_categories': low_spending_categories,
        'average_expense_inr': expenses_df['amount_inr'].mean() if not expenses_df.empty else 0,
        'most_expensive_category': categories_df['spent'].idxmax(),
        'budget_utilization_by_category': categories_df['utilization'].to_dict()
    }
    
    return insights

def generate_spending_recommendations(insights):
    """
    Generate personalized spending recommendations for students
    """
    recommendations = []
    
    if insights['savings_rate'] < 20:
        recommendations.append("Consider reducing expenses in high-spending categories to improve your savings rate.")
    
    for category in insights['high_spending_categories']:
        recommendations.append(f"You're spending heavily on {category}. Consider setting stricter limits.")
    
    for category in insights['low_spending_categories']:
        recommendations.append(f"You have room to spend more on {category} if needed.")
    
    if insights['average_expense_inr'] > 1000:  # ₹1000
        recommendations.append("Your average expense is quite high. Try to find more budget-friendly alternatives.")
    
    return recommendations

def create_budget_visualization(budget_data):
    """
    Create visualizations for budget analysis using matplotlib
    """
    categories_df = pd.DataFrame.from_dict(budget_data['categories'], orient='index')
    
    # Create pie chart for spending distribution
    plt.figure(figsize=(10, 6))
    
    plt.subplot(1, 2, 1)
    plt.pie(categories_df['spent'], labels=categories_df.index, autopct='%1.1f%%')
    plt.title('Spending Distribution by Category')
    
    plt.subplot(1, 2, 2)
    categories_df['utilization'] = (categories_df['spent'] / categories_df['budget']) * 100
    plt.bar(categories_df.index, categories_df['utilization'])
    plt.title('Budget Utilization by Category (%)')
    plt.xticks(rotation=45)
    plt.ylabel('Utilization %')
    
    plt.tight_layout()
    plt.savefig('budget_analysis.png')
    plt.show()

# Example usage
if __name__ == "__main__":
    # Sample budget data (would normally be loaded from localStorage or API)
    sample_data = {
        "totalBudget": 1200,
        "totalSpent": 680,
        "categories": {
            "Food & Dining": {"budget": 400, "spent": 280},
            "Transportation": {"budget": 200, "spent": 150},
            "Entertainment": {"budget": 150, "spent": 120},
            "Books & Supplies": {"budget": 250, "spent": 80},
            "Personal Care": {"budget": 100, "spent": 50}
        },
        "recentExpenses": [
            {"amount": 12.5, "category": "Food & Dining", "date": "2024-01-15"},
            {"amount": 45.0, "category": "Transportation", "date": "2024-01-14"},
            {"amount": 15.0, "category": "Entertainment", "date": "2024-01-13"}
        ]
    }
    
    # Analyze the budget
    insights = analyze_student_budget(sample_data)
    recommendations = generate_spending_recommendations(insights)
    
    print("=== STUDENT BUDGET ANALYSIS ===")
    print(f"Total Budget (INR): ₹{insights['total_budget_inr']:,.2f}")
    print(f"Total Spent (INR): ₹{insights['total_spent_inr']:,.2f}")
    print(f"Savings Rate: {insights['savings_rate']:.1f}%")
    print(f"Average Expense (INR): ₹{insights['average_expense_inr']:,.2f}")
    print(f"Most Expensive Category: {insights['most_expensive_category']}")
    
    print("\n=== RECOMMENDATIONS ===")
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec}")
    
    # Create visualizations
    create_budget_visualization(sample_data)
