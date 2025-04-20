def compute_tax(
    gross_salary=None,
    net_salary=None,
    contract_type='long_term',
    residency_status='resident',
    num_dependents=0,
    region=1,
    extra_incomes=None,
    company_bonus=None,
    already_withheld=None
):
    if extra_incomes is None:
        extra_incomes = {}
    if already_withheld is None:
        already_withheld = {}

    if net_salary and not gross_salary and contract_type == 'long_term':
        gross_salary = calculate_gross_from_net(net_salary, num_dependents)
    if not gross_salary:
        gross_salary = 0

    social_insurance = 0.105 * gross_salary if contract_type == 'long_term' and residency_status == 'resident' else 0

    personal_deduction = 11_000_000
    dependent_deduction = 4_400_000 * num_dependents
    taxable_income = gross_salary - social_insurance - personal_deduction - dependent_deduction
    if company_bonus:
        taxable_income += company_bonus

    income_tax = 0
    if residency_status == 'resident' and contract_type == 'long_term':
        income_tax = calculate_progressive_tax(taxable_income) if taxable_income > 0 else 0
    elif residency_status == 'non_resident':
        income_tax = round(gross_salary * 0.2)
    elif contract_type == 'short_term':
        income_tax = round(gross_salary * 0.10)

    # Thuế các nguồn khác
    flat_tax_rates = {
        'freelance': 0.07,
        'online_sales': 0.015,
        'food_transport_spa': 0.045,
        'investment': 0.05,
        'stocks': 0.001,
        'prizes': 0.10,
        'inheritance': 0.10,
        'rent': 0.10,
        'real_estate_sale': 0.02,
        'short_term_contract': 0.10,
    }

    flat_tax_total = 0
    flat_tax_breakdown = {}
    withheld_tax_total = 0
    withheld_tax_breakdown = {}

    for income_type, value in extra_incomes.items():
        rate = flat_tax_rates.get(income_type, 0)
        tax_amount = value * rate
        if income_type in already_withheld and already_withheld[income_type]:
            withheld_tax_breakdown[income_type] = round(tax_amount)
            withheld_tax_total += tax_amount
        else:
            flat_tax_breakdown[income_type] = round(tax_amount)
            flat_tax_total += tax_amount

    total_tax = income_tax + flat_tax_total
    refund_or_pay = total_tax - withheld_tax_total

    return {
        "gross_salary": round(gross_salary),
        "social_insurance": round(social_insurance),
        "taxable_income": round(taxable_income),
        "income_tax_luy_tien_or_10_20": round(income_tax),
        "flat_tax_other_sources": flat_tax_breakdown,
        "flat_tax_total": round(flat_tax_total),
        "withheld_tax_sources": withheld_tax_breakdown,
        "withheld_tax_total": round(withheld_tax_total),
        "total_tax_after_offset": round(total_tax),
        "tax_final_payment_or_refund": round(refund_or_pay)
    }

def calculate_gross_from_net(net_salary, num_dependents):
    personal_deduction = 11_000_000
    dependent_deduction = 4_400_000 * num_dependents
    social_insurance_rate = 0.105
    gross_salary = net_salary / (1 - social_insurance_rate)

    for _ in range(10):
        taxable_income = gross_salary * (1 - social_insurance_rate) - personal_deduction - dependent_deduction
        tax = calculate_progressive_tax(taxable_income) if taxable_income > 0 else 0
        estimated_net = gross_salary * (1 - social_insurance_rate) - tax
        gross_salary += (net_salary - estimated_net)
    return round(gross_salary)


def calculate_progressive_tax(taxable_income):
    brackets = [
        (0, 5_000_000, 0.05),
        (5_000_000, 10_000_000, 0.10),
        (10_000_000, 18_000_000, 0.15),
        (18_000_000, 32_000_000, 0.20),
        (32_000_000, 52_000_000, 0.25),
        (52_000_000, 80_000_000, 0.30),
        (80_000_000, float('inf'), 0.35)
    ]
    tax = 0
    for lower, upper, rate in brackets:
        if taxable_income > lower:
            taxed_amount = min(taxable_income, upper) - lower
            tax += taxed_amount * rate
    return round(tax)


def compute_tax(
    gross_salary=None,
    net_salary=None,
    contract_type='long_term',
    residency_status='resident',
    num_dependents=0,
    region=1,
    extra_incomes=None,
    company_bonus=None,
    already_withheld=None
):
    if extra_incomes is None:
        extra_incomes = {}
    if already_withheld is None:
        already_withheld = {}

    if net_salary and not gross_salary and contract_type == 'long_term':
        gross_salary = calculate_gross_from_net(net_salary, num_dependents)
    if not gross_salary:
        gross_salary = 0

    social_insurance = 0.105 * gross_salary if contract_type == 'long_term' and residency_status == 'resident' else 0

    personal_deduction = 11_000_000
    dependent_deduction = 4_400_000 * num_dependents
    taxable_income = gross_salary - social_insurance - personal_deduction - dependent_deduction
    if company_bonus:
        taxable_income += company_bonus

    income_tax = 0
    if residency_status == 'resident' and contract_type == 'long_term':
        income_tax = calculate_progressive_tax(taxable_income) if taxable_income > 0 else 0
    elif residency_status == 'non_resident':
        income_tax = round(gross_salary * 0.2)
    elif contract_type == 'short_term':
        income_tax = round(gross_salary * 0.10)

    flat_tax_rates = {
        'freelance': 0.07,
        'online_sales': 0.015,
        'food_transport_spa': 0.045,
        'investment': 0.05,
        'stocks': 0.001,
        'prizes': 0.10,
        'inheritance': 0.10,
        'rent': 0.10,
        'real_estate_sale': 0.02,
        'short_term_contract': 0.10,
    }

    flat_tax_total = 0
    flat_tax_breakdown = {}
    withheld_tax_total = 0
    withheld_tax_breakdown = {}

    for income_type, value in extra_incomes.items():
        rate = flat_tax_rates.get(income_type, 0)
        tax_amount = value * rate
        if already_withheld.get(income_type, False):
            withheld_tax_breakdown[income_type] = round(tax_amount)
            withheld_tax_total += tax_amount
        else:
            flat_tax_breakdown[income_type] = round(tax_amount)
            flat_tax_total += tax_amount

    total_tax = income_tax + flat_tax_total
    refund_or_pay = total_tax - withheld_tax_total

    return {
        "gross_salary": round(gross_salary),
        "social_insurance": round(social_insurance),
        "taxable_income": round(taxable_income),
        "income_tax_luy_tien_or_10_20": round(income_tax),
        "flat_tax_other_sources": flat_tax_breakdown,
        "flat_tax_total": round(flat_tax_total),
        "withheld_tax_sources": withheld_tax_breakdown,
        "withheld_tax_total": round(withheld_tax_total),
        "total_tax_after_offset": round(total_tax),
        "tax_final_payment_or_refund": round(refund_or_pay)
    }
result = compute_tax(
    net_salary=20000000,
    contract_type='long_term',
    residency_status='resident',
    num_dependents=1,
    extra_incomes={
        'freelance': 10_000_000,
        'rent': 120_000_000,
        'stocks': 15_000_000,
        'prizes': 20_000_000,
        'real_estate_sale': 1_000_000_000
    },
    already_withheld={
        'rent': True,
        'stocks': True,
        'real_estate_sale': True
    }
)
print(result)
