// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";

import { userService } from "@/OLD/services/user.service";

import { useRouter } from "next/router";

// Utils
import Masks from "@/OLD/utils/masks";
import { normalizeStr } from "@/OLD/utils/normalizeString";

// Hooks
import {
	useTutorOrigins,
	useUniquetutorOrigins,
} from "@/OLD/hooks/useTutorOrigins";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useProfessions } from "@/OLD/hooks/useProfessions";

// Components
import {
	Form,
	Input,
	Select,
	Upload,
	AutoComplete,
	Switch,
	Dropdown,
	Menu,
	Modal,
} from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import dynamic from "next/dynamic";
import CamBox from "@/OLD/components/mini-components/CamBox";
import MultipleContacts from "../MultipleContacts";

const ImgCrop = dynamic(() => import("antd-img-crop"), { ssr: false });
const { Option } = Select;

import { viacepService } from "@/OLD/services/viacep.service";
import { sortItems } from "@/OLD/utils/sortItems";
import { useToast } from "infinity-forge";
import { useConfigurationsSystem } from "@/presentation";

export const FormChild = React.memo(function FormChild({
	data,
	setData,
	setPhoto,
	contacts,
	setContacts,
	isSchedule,
}) {
	const [fileList, setFileList] = useState([]);
	const [states, setStates] = useState([]);
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openCam, setOpenCam] = useState(false);
	const [filters, setFilters] = useState(false);
	const [selectedOrigin, setSelectedOrigin] = useState(false);

	const { tutorOrigins } = useTutorOrigins();
	const selectOrigin = tutorOrigins?.find(
		(origin) => origin?.id === selectedOrigin,
	);
	const shouldDisplayMarketingSelect = selectedOrigin
		? selectedOrigin.default ||
			selectedOrigin.description === "Campanha de Mkt Ativa"
		: false;

	console.log({ data, selectedOrigin, selectedOrigin });

	const { tutorOrigins } = useTutorOrigins();

	const { professions } = useProfessions();
	const { uniqueOrigins } = useUniquetutorOrigins(selectedOrigin);

	const { createToast } = useToast();

	const router = useRouter();
	const inputNumberAddressRef = useRef();

	useEffect(() => {
		setFilters({ type: "Cadastro" });
	}, []);

	sortItems(tutorOrigins, "description");

	useEffect(() => {
		if (inputNumberAddressRef.current) {
			const fieldNumber = inputNumberAddressRef.current.input;
			fieldNumber.setAttribute("autocomplete", "off");
		}
	}, []);

	const getAddress = (cepData) => {
		setLoading(true);
		viacepService
			.getAddressByPostalCode(cepData)
			.then((res) => {
				setData({
					...data,
					postalCode: res.data.cep,
					district: res.data.bairro,
					street: res.data.logradouro,
					state: res.data.uf,
					city: res.data.localidade,
					complement: res.data.complemento,
					cityCode: res.data.ibge,
				});
			})
			.catch((_err) => {
				return createToast({
					status: "error",
					message: "Houve um erro ao buscar o cep informado",
				});
			});
	};

	const verifyDocument = (doc) => {
		let str = doc?.split("");

		if (str?.length <= 11) {
			for (let i = str?.length; i < 11; i += 1) {
				str?.unshift(0);
			}

			setData((prv) => ({
				...prv,
				document: Masks.cpf(str?.join(",").replaceAll(",", "")),
			}));
		}

		if (str?.length > 11) {
			for (let i = str?.length; i < 14; i += 1) {
				str?.unshift(0);
			}

			setData((prv) => ({
				...prv,
				document: Masks.cnpj(str?.join(",").replaceAll(",", "")),
			}));
		}

		userService
			.checkDocument(Masks?.noDocument(str?.join(",").replaceAll(",", "")))
			.then((res) => {
				if (!res?.data?.valid) {
					return createToast({ status: "error", message: "CPF Inválido" });
				}
			})
			.catch((err) => setLoading(false));
	};

	const { type } = useConfigurationsSystem();

	return (
		<div
			className="uk-flex uk-width-1-1 uk-flex-column uk-card uk-card-body"
			style={{
				gap: "10px",
				background: "#fff",
				borderRadius: "20px",
				boder: "2px",
				marginBottom: "20px",
			}}
		>
			<div>
				<h5 className="uk-heading-line uk-margin-remove">
					<span>Dados pessoais</span>
				</h5>
				<div className="uk-flex uk-flex-between">
					<Form.Item label="Perfil">
						<div className="img-box">
							<Dropdown
								trigger="click"
								overlay={
									<Menu
										items={[
											{
												key: "1",
												label: (
													<Upload
														onChange={(e) => {
															setFileList(e.fileList);
															if (e.fileList.length > 0) {
																setPhoto(e.fileList[0].originFileObj);
															} else {
																setPhoto(null);
															}
														}}
														accept=".png, .jpeg, .jpg"
														action=""
														method=""
													>
														<div>Buscar foto no pc</div>
													</Upload>
												),
											},
											{
												key: "2",
												label: (
													<div onClick={() => setOpenCam(true)}>
														Abrir Câmera
													</div>
												),
											},
										]}
									/>
								}
							>
								{fileList.length === 0 ? (
									<div className="add-image">+ imagem</div>
								) : (
									<img src={URL.createObjectURL(fileList[0].originFileObj)} />
								)}
							</Dropdown>
						</div>
					</Form.Item>
					<div className="uk-width-5-6">
						<div
							className="uk-flex"
							style={{
								gap: "10px",
							}}
						>
							<Form.Item
								label={
									<span>
										Nome<span style={{ color: "red" }}>*</span>
									</span>
								}
								className="uk-width-2-5"
							>
								<Input
									id={"name"}
									type="text"
									value={data?.name}
									required
									onChange={(e) => setData({ ...data, name: e.target.value })}
								/>
							</Form.Item>
							<Form.Item
								label={
									<span>
										CPF / CNPJ
										{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
									</span>
								}
								className="uk-width-1-6"
							>
								<Input
									onBlur={() =>
										data?.document &&
										verifyDocument(
											data?.document.replaceAll(".", "").replace("-", ""),
										)
									}
									id={"document"}
									type="text"
									value={data?.document}
									onChange={(e) =>
										setData({ ...data, document: e.target.value })
									}
								/>
							</Form.Item>
							<Form.Item label="RG" className="uk-width-1-6">
								<Input
									id={"rg"}
									type="rg"
									value={data?.inscription}
									onChange={(e) =>
										setData({ ...data, inscription: e.target.value })
									}
								/>
							</Form.Item>
							<Form.Item
								label={
									<span>
										Data de nascimento
										{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
									</span>
								}
								className="uk-width-1-5"
							>
								<DatePicker
									slotProps={{ textField: { variant: "standard" } }}
									id={"birthDate"}
									type="date"
									value={data?.birthDate}
									onChange={(val) => setData({ ...data, birthDate: val })}
								/>
							</Form.Item>
							{/*
              <Form.Item label="Email" className="uk-width-2-5">
                <Input
                  id={"email"}
                  type="email"
                  value={data?.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Celular">
                <Input
                  id={"cellphone"}
                  value={data?.cellphone}
                  required
                  onChange={(e) =>
                    setData({ ...data, cellphone: Masks.phone(e.target.value) })
                  }
                />
              </Form.Item>
              */}
						</div>
						<div
							className="uk-flex"
							style={{
								gap: "10px",
							}}
						>
							<Form.Item
								label={
									<span>
										Gênero
										{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
									</span>
								}
								className="uk-width-1-6"
							>
								<Select
									id={"gender"}
									value={data?.gender}
									onChange={(e) => setData({ ...data, gender: e })}
								>
									<option value="masculino">Masculino</option>
									<option value="feminino">Feminino</option>
									<option value="outros">Outros</option>
								</Select>
							</Form.Item>
							<Form.Item
								label={
									<span>
										Profissão
										{type === "Vet" ? (
											!isSchedule ? (
												<span style={{ color: "red" }}>*</span>
											) : (
												""
											)
										) : (
											""
										)}
									</span>
								}
								className="uk-width-1-3"
							>
								<AutoComplete
									options={professions.map((prof) => ({
										...prof,
										value: prof?.description,
									}))}
									value={data?.profDescription}
									onChange={(val) => setData({ ...data, profDescription: val })}
									filterOption={(val, opt) =>
										normalizeStr(opt?.value.toUpperCase()).includes(
											normalizeStr(val.toUpperCase()),
										)
									}
									onSelect={(_, opt) =>
										setData({
											...data,
											professionId: opt?.id,
											profDescription: opt?.value,
										})
									}
								/>
							</Form.Item>
							<Form.Item label="Estado Civil" className="uk-width-1-6">
								<Select
									value={data?.civilStatus}
									onChange={(val) => setData({ ...data, civilStatus: val })}
								>
									<Option value="Solteiro(a)">Solteiro(a)</Option>
									<Option value="Casado(a)">Casado(a)</Option>
									<Option value="Separado(a)">Separado(a)</Option>
									<Option value="Divorciado(a)">Divorciado(a)</Option>
									<Option value="Viuvo(a)">Viuvo(a)</Option>
								</Select>
							</Form.Item>
							<Form.Item label="Nacionalidade" className="uk-width-1-6">
								<Input
									value={data?.nationality}
									onChange={(e) =>
										setData({ ...data, nationality: e.target.value })
									}
								/>
							</Form.Item>
						</div>
						<section className="uk-flex uk-width-1-1" style={{ gap: "10px" }}>
							<Form.Item
								label={
									<span>
										Como conheceu a clinica?
										<span style={{ color: "red" }}>*</span>
									</span>
								}
								className="uk-width-1-3"
							>
								<Select
									required
									onChange={(e) => {
										setData({ ...data, clientOriginId: e });
										setSelectedOrigin(
											tutorOrigins?.find((item) => item?.id === e),
										);
									}}
								>
									{tutorOrigins.length > 0 &&
										tutorOrigins.map((origin, i) => (
											<Option key={i} value={origin?.id}>
												{origin?.description}
											</Option>
										))}
								</Select>
							</Form.Item>
							{selectedOrigin?.default && (
								<Form.Item label="Campanha Mídia" className="uk-width-1-4">
									<AutoComplete
										options={uniqueOrigins?.sort().map((item) => ({
											value: item,
											key: item,
										}))}
										value={data?.clientOriginItemDescription}
										onChange={(val) =>
											setData({ ...data, clientOriginItemDescription: val })
										}
										onSelect={(_, opt) =>
											setData({
												...data,
												clientOriginItemDescription: opt?.value,
											})
										}
										filterOption={(inputValue, option) =>
											option.value
												.toUpperCase()
												.includes(inputValue.toUpperCase())
												? option
												: null
										}
									/>
								</Form.Item>
							)}
							<Form.Item label="Tag" className="uk-width-1-6">
								<Input
									id={"document"}
									type="tag"
									value={data?.tags}
									onChange={(e) => setData({ ...data, tags: e.target.value })}
								/>
							</Form.Item>
						</section>

						{type !== "Vet" && (
							<div className="uk-flex">
								<div className="uk-flex uk-flex-column uk-width-1-6">
									<label>Diabetes</label>
									<Switch
										checked={data?.diabetes}
										onChange={(val) => setData({ ...data, diabetes: val })}
										className="uk-width-1-5"
									/>
								</div>
								<div className="uk-flex uk-flex-column uk-width-1-6">
									<label>Hipertensão</label>
									<Switch
										checked={data?.hypertension}
										onChange={(val) => setData({ ...data, hypertension: val })}
										className="uk-width-1-5"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<MultipleContacts contacts={contacts} setContacts={setContacts} />
			<div>
				<h5 className="uk-heading-line uk-margin-remove">
					<span>Endereço</span>
				</h5>
				<div
					className="uk-flex"
					style={{
						gap: "10px",
					}}
				>
					<Form.Item
						label={
							<span>
								CEP
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
						className="uk-width-1-5"
					>
						<Input
							id={"postalCode"}
							type="number"
							value={data?.postal_code}
							onChange={(e) => {
								e.target.value.length === 8 && getAddress(e.target.value);
								setData({ ...data, postalCode: e.target.value });
							}}
						/>
					</Form.Item>
					<Form.Item
						label={
							<span>
								Rua
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
						className="uk-width-2-5"
					>
						<Input
							id={"street"}
							type="text"
							value={data?.street}
							onChange={(e) => setData({ ...data, street: e.target.value })}
						/>
					</Form.Item>
					<Form.Item
						label={
							<span>
								Número
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
					>
						<Input
							id={"number"}
							type="text"
							value={data?.number}
							onChange={(e) => setData({ ...data, number: e.target.value })}
							ref={inputNumberAddressRef}
						/>
					</Form.Item>
					<Form.Item label="Complemento" className="uk-width-2-5">
						<Input
							id={"complement"}
							type="text"
							value={data?.complement}
							onChange={(e) => setData({ ...data, complement: e.target.value })}
						/>
					</Form.Item>
				</div>
				<div
					className="uk-flex"
					style={{
						gap: "10px",
					}}
				>
					<Form.Item
						label={
							<span>
								Bairro
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
						className="uk-width-1-3"
					>
						<Input
							id={"district"}
							type="text"
							value={data?.district}
							onChange={(e) => setData({ ...data, district: e.target.value })}
						/>
					</Form.Item>
					<Form.Item
						label={
							<span>
								Estado
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
						className="uk-width-1-3"
					>
						<Select
							onChange={(e) => setData({ ...data, state: e })}
							value={data?.state}
						>
							{states.length > 0 &&
								states.map((item, i) => (
									<Option value={item.value} key={i}>
										{item.value}
									</Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item
						label={
							<span>
								Cidade
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
						className="uk-width-1-3"
					>
						<AutoComplete
							className="uk-width-1-1"
							value={data?.city}
							options={cities}
							onChange={(e) => setData({ ...data, city: e })}
							onSelect={(e) => setData({ ...data, city: e })}
							filterOption={(inputValue, option) =>
								option.label.toUpperCase().includes(inputValue.toUpperCase())
									? option
									: null
							}
						/>
					</Form.Item>
					<Form.Item
						label={
							<span>
								Tipo de residência
								{!isSchedule ? <span style={{ color: "red" }}>*</span> : ""}
							</span>
						}
						className="uk-width-1-4"
					>
						<Select
							required
							className="uk-width-1-4"
							onChange={(e) => setData({ ...data, residence: e })}
							value={data?.residence}
						>
							<Option value="CASA">Casa</Option>
							<Option value="APARTAMENTO">Apartamento</Option>
							<Option value="CONDOMINIO">Condominio</Option>
							<Option value="SITIO">Sitio</Option>
							<Option value="COMERCIAL">Comercial</Option>
						</Select>
					</Form.Item>
					<Form.Item label="Código da cidade" className="uk-width-1-4">
						<Input
							id={"cityCode"}
							readOnly
							value={data?.cityCode}
							onChange={(e) => setData({ ...data, cityCode: e.target.value })}
						/>
					</Form.Item>
				</div>
				{router.query.innerpage && (
					<div className="uk-text-muted uk-text-center">
						{" "}
						Pet irá ser vinculado ao tutor adicionado{" "}
					</div>
				)}
			</div>
			<Modal
				title="Tirar Foto"
				visible={openCam}
				onCancel={() => setOpenCam(false)}
				footer={null}
			>
				<CamBox setVisible={setOpenCam} setFileList={setFileList} />
			</Modal>
		</div>
	);
});
