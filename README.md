# The Forkcast Manifesto

_Forkcast accelerates Ethereum network upgrades by removing friction from the AllCoreDevs process._

Less friction means:

* Less wasted effort and burnout
* More engaged and productive participants
* Faster, more ambitious Ethereum upgrades

### Where friction lives

The Ethereum upgrade process is a complex system with many stakeholders. Friction may be found in:

* **Identifying stakeholder priorities:** Before specific EIPs are evaluated, it's valuable to understand broadly what is most important to each Ethereum stakeholder group.
* **Understanding stakeholder impact:** While being evaluated, each EIP requires specific and timely feedback from relevant stakeholders.
* **Managing proposal volume:** More EIPs are proposed than any one client team can reasonably evaluate for a given upgrade.
* **Maximizing synchronous time:** Weekly synchronous meetings must make good use of the valuable hours offered by its attendees.
* **Aggregating disparate context:** Important decision-making context lives across many platforms and mediums.
* **Surfacing readiness signals:** Only sufficiently mature proposals should be championed for inclusion in the next upgrade.
* **Ambiguous ownership:** EIPs generally require a champion to make it into an upgrade.

### Who we serve

Forkcast’s priority persona is the median client developer: an experienced software engineer with 1-2 years under their belt as a full-time EL or CL contributor. They’re heads down implementing features, squashing bugs, and optimizing performance. They do not have the bandwidth to attend and keep up with every ACD call, EIP proposal, and Ethereum Magicians thread. They rely on their colleagues and social media for TL;DRs. They may not yet be confident enough to champion their own EIPs, but may aspire to one day. Why this persona? They feel the friction most and have the ability to act on it.

A priority persona honorable mention is the ACD facilitator. Call and process facilitators have an outsized impact on the focus and delivery of network upgrades, given their mandate to collect, distill, and act upon the preferences of a wide variety of stakeholders.

More generally, the aim is to be useful to high-context individuals with the greatest ability to push Ethereum forward.

Additional personas served in various capacities:

* Client developers, both new and experienced
* EIP authors and champions
* Testing teams (e.g., ethPandaOps, STEEL, consensus testing)
* L2 chain developers
* App developers
* End users and enthusiasts

### How we serve

Forkcast:

* makes accessible the "state of the world" - the current process timeline, what's being proposed, and the impacts of proposals
* provides tools for stakeholders to understand and communicate preferences
* is a collection of social experiments and will evolve quickly in response to the needs of the upgrade process

### 與上游 Forkcast 同步（本專案維護用）

本專案衍生自 [ethereum/forkcast](https://github.com/ethereum/forkcast)，**內容經過轉譯／在地化**，因此不宜直接 merge 上游程式碼，否則會覆蓋譯文與在地內容。

- **自動提醒**：GitHub Action「Sync upstream Forkcast」每天會檢查 [ethereum/forkcast](https://github.com/ethereum/forkcast) 的 `main`。若有新 commit，會**開一則 Issue**（或在同一則 Issue 下留言），附上上游差異連結與 commit 列表，提醒你手動檢視、轉譯後再合併需要的變更。也可在 Actions 頁手動執行該 workflow。
- **手動**：本機設定 upstream 後自行檢視差異，再決定要 port 哪些並轉譯：
  ```bash
  git remote add upstream https://github.com/ethereum/forkcast.git   # 只需做一次
  git fetch upstream main
  # 檢視差異，手動挑選並轉譯後再合併到本專案
  git log main..upstream/main --oneline
  ```