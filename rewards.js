const rewardPointsDisplay = document.getElementById("reward-points");
const rewardOptions = document.getElementById("reward-options");
const redeemRewardBtn = document.getElementById("redeem-reward");
const leaderboardList = document.getElementById("leaderboard");

let rewardsData = JSON.parse(localStorage.getItem("rewards")) || { points: 0, leaderboard: [] };

// Update UI with stored data
function updateRewardsUI() {
    rewardPointsDisplay.textContent = rewardsData.points;

    // Update leaderboard
    leaderboardList.innerHTML = "";
    rewardsData.leaderboard.forEach((entry, index) => {
        let li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.name} - ${entry.points} Points`;
        leaderboardList.appendChild(li);
    });

    // Save data to local storage
    localStorage.setItem("rewards", JSON.stringify(rewardsData));
}

// Function to add points (called when attendance is marked)
function addRewardPoints(points) {
    rewardsData.points += points;
    updateRewardsUI();
}

// Function to redeem a reward
function redeemReward() {
    let selectedOption = rewardOptions.options[rewardOptions.selectedIndex];
    let cost = parseInt(selectedOption.getAttribute("data-cost"));

    if (rewardsData.points >= cost) {
        rewardsData.points -= cost;
        alert(`🎉 You have redeemed: ${selectedOption.textContent}`);
        updateRewardsUI();
    } else {
        alert("⚠️ Not enough points to redeem this reward.");
    }
}

// Event Listener for Redeeming Rewards
redeemRewardBtn.addEventListener("click", redeemReward);

// Function to update leaderboard (for now, random top scorers)
function updateLeaderboard() {
    rewardsData.leaderboard = [
        { name: "Alex", points: Math.floor(Math.random() * 300) },
        { name: "Jamie", points: Math.floor(Math.random() * 250) },
        { name: "Taylor", points: Math.floor(Math.random() * 200) }
    ];
    updateRewardsUI();
}

// Initialize UI
updateRewardsUI();
updateLeaderboard();
