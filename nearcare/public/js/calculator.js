document.addEventListener('DOMContentLoaded', () => {
    let selectedGrade = null;
    let selectedTime = null;
    let selectedCost = null;

    // Handle button clicks for grade selection
    document.querySelectorAll('.grade-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.grade-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedGrade = button.getAttribute('data-grade');
        });
    });

    // Handle button clicks for time selection
    document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTime = button.getAttribute('data-time');
        });
    });

    // Handle button clicks for cost selection
    document.querySelectorAll('.cost-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.cost-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedCost = button.getAttribute('data-cost');
        });
    });

    // Calculate and display the support amount
    document.getElementById('calculate-button').addEventListener('click', () => {
        if (selectedGrade && selectedTime && selectedCost) {
            const time = parseInt(selectedTime, 10);
            const costPercentage = parseInt(selectedCost, 10);

            // Example cost calculation
            const baseAmount = 10000; // Base amount for calculation, can be modified
            const supportAmount = baseAmount * (time / 60) * (costPercentage / 100);

            // Display results
            document.getElementById('support-amount').textContent = `지원금: ₩${supportAmount.toLocaleString()}`;
            document.getElementById('calculation-details').textContent = `
                계산식: (기본금액 ${baseAmount}원) x (시간(${time} / 60)) x (비율(${costPercentage}%))
            `;
        } else {
            alert('모든 항목을 선택해 주세요.');
        }
    });
});
