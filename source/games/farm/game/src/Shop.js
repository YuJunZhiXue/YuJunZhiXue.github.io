import { CROP_DATA, getSellPrice } from './World.js';
import { TOOL_TIERS, UPGRADEABLE_TOOLS, nextTierCost } from './Tools.js';

// The economy interface: holds the player's money and the buy/sell logic, and
// renders a self-contained DOM overlay. Toggled from Game with the `B` key.
// The shop is modal — while it's open the player isn't farming, so the
// inventory only changes through buy/sell here.
export default class Shop {
    constructor(inventory, startingMoney = 100, events = null) {
        this.inventory = inventory;
        this.money = startingMoney;
        this.events = events;
        this.isOpen = false;
        this.tab = 'buy'; // 'buy' | 'sell'
        this.season = null; // current season, set by Game for the buy-tab highlight

        this.root = null;   // built lazily on first render
        this.dirty = true;  // only rebuild the DOM when something changed
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.dirty = true;
    }

    close() {
        this.isOpen = false;
        this.dirty = true;
    }

    setTab(tab) {
        if (this.tab !== tab) {
            this.tab = tab;
            this.dirty = true;
        }
    }

    // Buy one seed of `seedName`, if affordable. Returns true on success.
    buySeed(seedName) {
        const row = CROP_DATA[seedName];
        if (!row || this.money < row.seedPrice) return false;
        this.money -= row.seedPrice;
        this.inventory.addItem({
            name: seedName,
            type: 'seed',
            icon: seedName.charAt(0).toLowerCase(),
            count: 1
        });
        this.dirty = true;
        return true;
    }

    // Sell one harvested resource named `resourceName`. Returns true on success.
    sellResource(resourceName) {
        const idx = this.inventory.slots.findIndex(
            (s) => s && s.type === 'resource' && s.name === resourceName
        );
        if (idx < 0) return false;
        const price = getSellPrice(resourceName);
        if (price <= 0) return false;

        const item = this.inventory.slots[idx];
        this.money += price;
        item.count = (item.count || 1) - 1;
        if (item.count <= 0) this.inventory.slots[idx] = null;
        this.dirty = true;
        if (this.events) this.events.emit('item:sold', { name: resourceName, price });
        return true;
    }

    serialize() {
        return { money: this.money };
    }

    deserialize(d) {
        if (d && typeof d.money === 'number') {
            this.money = d.money;
            this.dirty = true;
        }
    }

    // Distinct sellable resources currently in the inventory.
    getSellableItems() {
        return this.inventory.slots
            .filter((s) => s && s.type === 'resource' && getSellPrice(s.name) > 0)
            .map((s) => ({ name: s.name, count: s.count || 1, price: getSellPrice(s.name) }));
    }

    render() {
        if (!this.dirty) return;
        this.dirty = false;

        if (!this.root) this.buildShell();
        this.root.style.display = this.isOpen ? 'flex' : 'none';
        if (!this.isOpen) return;

        this.moneyEl.textContent = `$${this.money}`;
        this.buyTabBtn.classList.toggle('active', this.tab === 'buy');
        this.sellTabBtn.classList.toggle('active', this.tab === 'sell');
        this.toolsTabBtn.classList.toggle('active', this.tab === 'tools');

        this.list.innerHTML = '';
        if (this.tab === 'buy') this.renderBuyRows();
        else if (this.tab === 'sell') this.renderSellRows();
        else this.renderToolRows();
    }

    renderToolRows() {
        for (const toolName of UPGRADEABLE_TOOLS) {
            const tool = this.inventory.slots.find((s) => s && s.name === toolName);
            if (!tool) continue;
            const tier = tool.tier || 0;
            const cost = nextTierCost(tier);
            if (cost === undefined) {
                this.list.appendChild(this.makeRow(`${toolName} · ${TOOL_TIERS[tier]}`, 'MAX', '—', false, () => {}));
            } else {
                const label = `${toolName} · ${TOOL_TIERS[tier]} → ${TOOL_TIERS[tier + 1]}`;
                this.list.appendChild(this.makeRow(label, `$${cost}`, 'Upgrade', this.money >= cost, () => {
                    this.upgradeTool(toolName);
                    this.render();
                }));
            }
        }
    }

    // Upgrade a tool one tier if affordable and not maxed. Returns true on success.
    upgradeTool(toolName) {
        const tool = this.inventory.slots.find((s) => s && s.name === toolName);
        if (!tool) return false;
        const tier = tool.tier || 0;
        const cost = nextTierCost(tier);
        if (cost === undefined || this.money < cost) return false;
        this.money -= cost;
        tool.tier = tier + 1;
        this.dirty = true;
        return true;
    }

    renderBuyRows() {
        for (const seedName of Object.keys(CROP_DATA)) {
            const data = CROP_DATA[seedName];
            const price = data.seedPrice;
            const affordable = this.money >= price;
            const seasons = data.seasons || ['any'];
            const inSeason = !this.season || seasons.includes(this.season);
            const label = `${seedName} · ${seasons.join('/')}`;
            this.list.appendChild(this.makeRow(label, `$${price}`, 'Buy', affordable, () => {
                this.buySeed(seedName);
                this.render();
            }, inSeason ? 'in-season' : 'out-season'));
        }
    }

    renderSellRows() {
        const items = this.getSellableItems();
        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'shop-empty';
            empty.textContent = 'Nothing to sell — go harvest some crops!';
            this.list.appendChild(empty);
            return;
        }
        for (const item of items) {
            this.list.appendChild(this.makeRow(
                `${item.name} ×${item.count}`, `$${item.price} ea`, 'Sell', true, () => {
                    this.sellResource(item.name);
                    this.render();
                }
            ));
        }
    }

    makeRow(label, price, btnText, enabled, onClick, rowClass = '') {
        const row = document.createElement('div');
        row.className = 'shop-row';
        if (rowClass) row.classList.add(rowClass);

        const name = document.createElement('span');
        name.className = 'shop-item-name';
        name.textContent = label;

        const cost = document.createElement('span');
        cost.className = 'shop-item-price';
        cost.textContent = price;

        const btn = document.createElement('button');
        btn.className = 'shop-btn';
        btn.textContent = btnText;
        btn.disabled = !enabled;
        btn.addEventListener('click', onClick);

        row.append(name, cost, btn);
        return row;
    }

    buildShell() {
        this.root = document.createElement('div');
        this.root.id = 'shop-overlay';

        const panel = document.createElement('div');
        panel.id = 'shop-panel';

        const header = document.createElement('div');
        header.className = 'shop-header';
        const title = document.createElement('span');
        title.textContent = 'General Store';
        this.moneyEl = document.createElement('span');
        this.moneyEl.className = 'shop-money';
        header.append(title, this.moneyEl);

        const tabs = document.createElement('div');
        tabs.className = 'shop-tabs';
        this.buyTabBtn = document.createElement('button');
        this.buyTabBtn.textContent = 'Buy Seeds';
        this.buyTabBtn.addEventListener('click', () => { this.setTab('buy'); this.render(); });
        this.sellTabBtn = document.createElement('button');
        this.sellTabBtn.textContent = 'Sell Crops';
        this.sellTabBtn.addEventListener('click', () => { this.setTab('sell'); this.render(); });
        this.toolsTabBtn = document.createElement('button');
        this.toolsTabBtn.textContent = 'Tools';
        this.toolsTabBtn.addEventListener('click', () => { this.setTab('tools'); this.render(); });
        tabs.append(this.buyTabBtn, this.sellTabBtn, this.toolsTabBtn);

        this.list = document.createElement('div');
        this.list.className = 'shop-list';

        const footer = document.createElement('div');
        footer.className = 'shop-footer';
        footer.textContent = 'Press B to close';

        panel.append(header, tabs, this.list, footer);
        this.root.appendChild(panel);

        const uiLayer = document.getElementById('ui-layer') || document.body;
        uiLayer.appendChild(this.root);
    }
}
