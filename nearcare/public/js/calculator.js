document.addEventListener('DOMContentLoaded', () => {
    let selectedGrade = null;
    let selectedTime = null;
    let selectedCost = null;

    document.querySelectorAll('.grade-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.grade-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedGrade = button.getAttribute('data-grade');
            updateResults();
        });
    });

    document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTime = button.getAttribute('data-time');
            updateResults();
        });
    });

    document.querySelectorAll('.cost-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.cost-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedCost = button.getAttribute('data-cost');
            updateResults();
        });
    });

    document.getElementById('calculate-button').addEventListener('click', () => {
        if (selectedGrade && selectedTime && selectedCost) {
            const time = parseInt(selectedTime, 10);
            const costPercentage = parseInt(selectedCost, 10);
            const baseAmounts = { 60: 24120, 120: 41380, 180: 54320, 240: 66770 };
            const gradeLimits = { 1: 2069900, 2: 1869600, 3: 1455800, 4: 1341800, 5: 1151600 };
            const gradeDays = { 1: 31, 2: 28, 3: 27, 4: 25, 5: 21 };

            const baseAmount = baseAmounts[selectedTime];
            const days = gradeDays[selectedGrade];
            
            const totalAmount = baseAmount * days;

            const supportPercentages = { 15: 0.85, 9: 0.91, 6: 0.94, 0: 1 };
            const supportPercentage = supportPercentages[selectedCost];

            const supportAmount = totalAmount * supportPercentage;
            const gradeLimit = gradeLimits[selectedGrade];
            const receivedAmount = Math.min(supportAmount, gradeLimit);
            const burdenAmount = totalAmount - receivedAmount;

            const formatAmount = amount => (Math.round(amount)).toLocaleString('en-US');

            document.getElementById('result').innerHTML = `
                <p>일수: ${days}일</p>
                <p>총 금액: ₩${formatAmount(totalAmount)}</p>
                <p>지원받은 금액: ₩${formatAmount(receivedAmount)}</p>
                <p>부담 금액: ₩${formatAmount(burdenAmount)}</p>
            `;
        } else {
            document.getElementById('result').innerHTML = `<p>모든 항목을 클릭해 주세요.</p>`;
        }
    });

    function updateResults() {
        if (selectedGrade && selectedTime && selectedCost) {
            document.getElementById('result').innerHTML = '';
        }
    }
});
