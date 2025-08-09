<script lang="ts">
</script>

<p>⚠️ This never worked correctly ⚠️</p>

<style>
	p {
		font-size: 20px;
		text-align: center;
		margin: 20px 0;
	}

	.upload {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}

	.upload input[type='file'] {
		padding: 10px;
		border: none;
		border: #ffffff 1px solid;
		border-radius: 10px;
	}

	.upload input[type='file']::file-selector-button {
		background: white;
		border: none;
		padding: 10px;
		margin-right: 10px;
		border-radius: 5px;
		color: var(--color-theme-1);
		box-sizing: border-box;
	}

	.upload input[type='file']::file-selector-button:hover {
		border: red 1px solid;
	}

	.upload button {
		margin: 0px;
		padding: 10px;
		border: #4caf50 2px solid;
		color: #4caf50;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.2s;
	}

	.upload button:hover:enabled {
		background-color: #4caf50;
		color: white;
	}

	.upload button:disabled {
		border: #ffffff 1px solid;
		color: white;
		cursor: not-allowed;
	}

	.downloads {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 20px;
	}

	.file {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
	}

	.delete {
		margin-top: 10px;
		padding: 5px 10px;
		border: #ff0000 2px solid;
		color: #ff0000;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.2s;
	}

	.delete:hover {
		background-color: #ff0000;
		color: #fff;
	}
</style>
